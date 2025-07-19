import { and, eq, gte, lte } from "drizzle-orm";
import { db } from "../db";
import { schemas } from "../db/schemas";
import type { ProtectedHttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpCreated, HttpOk } from "../utils/helpers/http-response-helper";
import z from "zod";

const schema = z.object({
  date: z.iso.date().transform(str => new Date(str))
})

export class ListMealsController {
  static async handle({userId, queryParams}: ProtectedHttpRequest): Promise<HttpResponse> {
    const {success, data, error} = schema.safeParse(queryParams)
            
        if (!success) {
          return HttpBadRequest({
            errors: error.issues
          })
        }
    
        const endDate = new Date(data.date)
        endDate.setUTCHours(23, 59, 59, 999)
        
    const meals = await db.query.meals.findMany({
      columns: {
        id: true,
        name: true,
        foods: true,
        createdAt: true,
        icon: true
      },
      where: and(
        eq(schemas.meals.userId, userId),
        gte(schemas.meals.createdAt, data.date),
        lte(schemas.meals.createdAt, endDate),
        eq(schemas.meals.status, 'SUCCESS')
      )
    })
    
    return HttpOk({
      meals
    })
  }
}