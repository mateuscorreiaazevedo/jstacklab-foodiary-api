import { db } from "../db";
import { schemas } from "../db/schemas";
import type { ProtectedHttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpCreated } from "../utils/helpers/http-response-helper";
import z from "zod";

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
      mealId: meal.mealId
    })
  }
}