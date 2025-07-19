import { eq } from "drizzle-orm";
import { db } from "../db";
import { schemas } from "../db/schemas";
import type { ProtectedHttpRequest, HttpResponse } from "../types/http";
import { HttpOk, HttpUnauthorized } from "../utils/helpers/http-response-helper";

export class MeController {
  static async handle({userId}: ProtectedHttpRequest): Promise<HttpResponse> {
    const [user] = await db.select({
      id: schemas.accounts.id,
      email: schemas.accounts.email,
      name: schemas.accounts.name,
      calories: schemas.accounts.calories,
      proteins: schemas.accounts.proteins,
      carbs: schemas.accounts.carbs,
      fats: schemas.accounts.fats,
    }).from(schemas.accounts).where(eq(schemas.accounts.id, userId))

    if (!user) {
      return HttpUnauthorized({
        errors: ['User not found']
      })
    }

    return HttpOk({
      ...user
    })
  }
}