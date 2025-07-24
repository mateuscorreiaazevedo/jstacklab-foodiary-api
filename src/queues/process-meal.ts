import { eq } from "drizzle-orm";
import { db } from "../db";
import { schemas } from "../db/schemas";
import { getMealDetailsFromImage, getMealDetailsFromText, transcribeAudio } from "../services/ai";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../client/s3-client";
import { Readable } from "node:stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class ProcessMeal {
  static async process({ fileKey }: { fileKey: string }) {
    const meal = await db.query.meals.findFirst({
      where: eq(schemas.meals.inputFileKey, fileKey),
    });

    if (!meal) {
      throw new Error('Meal not found.');
    }

    if (meal.status === 'FAILED' || meal.status === 'SUCCESS') {
      return;
    }

    await db
      .update(schemas.meals)
      .set({ status: 'PROCESSING' })
      .where(eq(schemas.meals.id, meal.id));

    try {
      let icon = '';
      let name = '';
      let foods = [];

      if (meal.inputType === 'AUDIO') {
        const audioFileBuffer = await this.downloadAudioFile(meal.inputFileKey);
        const transcription = await transcribeAudio(audioFileBuffer);

        const mealDetails = await getMealDetailsFromText({
          createdAt: new Date(),
          text: transcription,
        });

        icon = mealDetails.icon;
        name = mealDetails.name;
        foods = mealDetails.foods;
      }

      if (meal.inputType === 'IMAGE') {
        const imageURL = await this.getImageURL(meal.inputFileKey);

        const mealDetails = await getMealDetailsFromImage({
          createdAt: meal.createdAt,
          imageURL,
        });

        icon = mealDetails.icon;
        name = mealDetails.name;
        foods = mealDetails.foods;
      }

      await db
        .update(schemas.meals)
        .set({
          status: 'SUCCESS',
          name,
          icon,
          foods,
        })
        .where(eq(schemas.meals.id, meal.id));

    } catch (error) {
      console.log(error);

      await db
        .update(schemas.meals)
        .set({ status: 'FAILED' })
        .where(eq(schemas.meals.id, meal.id));
    }
  }

  private static async downloadAudioFile(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    const { Body } = await s3Client.send(command);

    if (!Body || !(Body instanceof Readable)) {
      throw new Error('Cannot load the audio file.');
    }

    const chunks = [];
    for await (const chunk of Body) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  private static async getImageURL(fileKey: string) {
    const command = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey,
    });

    return getSignedUrl(s3Client, command, { expiresIn: 600 });
  }
}