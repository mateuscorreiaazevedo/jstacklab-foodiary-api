import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { schemas } from "../db/schemas";
import type { ProtectedHttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpCreated, HttpOk } from "../utils/helpers/http-response-helper";
import z from "zod";

const schema = z.object({
  mealId: z.uuid(),
})

export class GetMealByIdController {
  static async handle({userId, params}: ProtectedHttpRequest): Promise<HttpResponse> {
    const {success, data, error} = schema.safeParse(params)
            
        if (!success) {
          return HttpBadRequest({
            errors: error.issues
          })
        }
    
       
        
    const [meal] = await db.select({
      id: schemas.meals.id,
      name: schemas.meals.name,
      foods: schemas.meals.foods,
      status: schemas.meals.status,
      createdAt: schemas.meals.createdAt,
      icon: schemas.meals.icon
    }).from(schemas.meals).where(and(eq(schemas.meals.id, data.mealId), eq(schemas.meals.userId, userId)))
    
    return HttpOk({
      meal
    })
  }
}