import z from "zod";
import type { HttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpOk, HttpUnauthorized } from "../utils/helpers/http-response-helper";
import { db } from "../db";
import { schemas } from "../db/schemas";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs'

import { signAccessTokenFor } from "../lib/jwt";

const schema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

export class SignInController {
  static async handle({body}: HttpRequest): Promise<HttpResponse> {
    const {success, data, error} = schema.safeParse(body)
        
    if (!success) {
      return HttpBadRequest({
        errors: error.issues
      })
    }
    
    const [user] = await db.select({
          id: schemas.accounts.id,
          hashedPassword: schemas.accounts.password 
        }).from(schemas.accounts).where(eq(schemas.accounts.email, data.email))
    
  if (!user || !(bcrypt.compareSync(data.password, user.hashedPassword))) {
    return HttpUnauthorized({
      errors: ['Email or password is incorrect']
    })
  }
    
  const accessToken = signAccessTokenFor(user.id)
  
    return HttpOk({
      accessToken
    })
  }
}