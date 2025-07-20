import { eq } from "drizzle-orm";
import { db } from "../db";
import { schemas } from "../db/schemas";
import { transcribeAudio } from "../services/ai";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../client/s3-client";
import { HttpBadRequest } from "../utils/helpers/http-response-helper";
import { Readable } from "node:stream";

export class ProcessMeal {
  static async process({fileKey}: {fileKey: string}) {
    const meal = await db.query.meals.findFirst({
      where: eq(schemas.meals.inputFileKey, fileKey),
    })

    if (!meal) {
      throw new Error('Meal not found')
    }

    if (meal.status === 'FAILED' || meal.status === 'SUCCESS') {
      return
    }

    await db.update(schemas.meals).set({
      status: 'PROCESSING'
    }).where(eq(schemas.meals.id, meal.id))

    try {
      // TODO: Call IA

      if (meal.inputType === 'AUDIO') {
        const command = new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: meal.inputFileKey,
        })

        const {Body} = await s3Client.send(command)

        if (!Body || !(Body instanceof Readable)) {
          return HttpBadRequest({
            errors: ['File not found']
          })
        }

        const chunks = []
        for await (const chunk of Body) {
          chunks.push(chunk)
        }

        const audioBuffer = Buffer.concat(chunks)
        
        const text = await transcribeAudio(audioBuffer)
      }
      
      await db.update(schemas.meals).set({
        status: 'SUCCESS',
        name: 'Cafézinho',
        icon: '☕️',
        foods: [
          {
            name: 'Café',
            quantity: 1,
            calories: 0,
            proteins: 0,
            carbs: 0,
            fats: 0,
          }
        ]
      }).where(eq(schemas.meals.id, meal.id))
    } catch (error) {
      await db.update(schemas.meals).set({
        status: 'FAILED'
      }).where(eq(schemas.meals.id, meal.id))
    }
  }
}