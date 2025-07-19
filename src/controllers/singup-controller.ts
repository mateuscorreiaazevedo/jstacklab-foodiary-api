import z from "zod";
import type { HttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpConflict, HttpCreated } from "../utils/helpers/http-response-helper";
import { db } from "../db";
import { schemas } from "../db/schemas";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs'

const schema = z.object({
  goal: z.enum(['LOSE', 'GAIN', 'MAINTAIN']),
  gender: z.enum(['MALE', 'FEMALE']),
  birthDate: z.iso.date(),
  height: z.number(),
  weight: z.number(),
  activityLevel: z.number().min(1).max(5),
  account: z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
  })
})

export class SignUpController {
  static async handle({body}: HttpRequest): Promise<HttpResponse> {
    const {success, data, error} = schema.safeParse(body)
    
    if (!success) {
      return HttpBadRequest({
        errors: error.issues
      })
    }

    const userAlreadyExists = await db.select({
      email: schemas.accounts.email
    }).from(schemas.accounts).where(eq(schemas.accounts.email, data.account.email))

    if (userAlreadyExists[0]) {
      return HttpConflict({
        errors: ['User already exists']
      })
    }

    const {account, ...restData} = data
    
    const hashedPassword = await bcrypt.hash(account.password, 10)
    
    const [user] = await db.insert(schemas.accounts).values({
      ...restData,
      ...account,
      password: hashedPassword,
      calories: 0,
      carbs: 0,
      fats: 0,
      proteins: 0
    }).returning({
      userId: schemas.accounts.id,
    })

    return HttpCreated({
      ...user
    })
  }
}