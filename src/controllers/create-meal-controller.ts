import { PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "../db";
import { schemas } from "../db/schemas";
import type { ProtectedHttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpCreated } from "../utils/helpers/http-response-helper";
import z from "zod";
import { randomUUID } from "crypto";

import {getSignedUrl} from '@aws-sdk/s3-request-presigner'
import { s3Client } from "../client/s3-client";

const schema = z.object({
  fileType: z.enum(['audio/m4a', 'image/jpeg'])
})

export class CreateMealController {
  static async handle({userId, body}: ProtectedHttpRequest): Promise<HttpResponse> {
    const {success, data, error} = schema.safeParse(body)
            
    if (!success) {
      return HttpBadRequest({
        errors: error.issues
      })
    }
    
    const fileId = randomUUID();
    const fileExtension = data.fileType === 'audio/m4a' ? '.m4a' : '.jpeg';
    const fileKey = `${fileId}${fileExtension}`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: fileKey, 
    })

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 600 // 10 minutes
    })
    
    const [meal] = await db.insert(schemas.meals).values({
      userId,
      icon: '',
      inputFileKey: 'input_file_key',
      inputType: data.fileType === 'audio/m4a' ? 'AUDIO' : 'IMAGE',
      status: 'UPLOADING',
      name: '',
    }).returning({
      mealId: schemas.meals.id,
    })

    return HttpCreated({
      mealId: meal.mealId,
      uploadUrl: presignedUrl
    })
  }
}