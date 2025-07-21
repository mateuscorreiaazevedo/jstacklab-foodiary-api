import z from "zod";
import type { HttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpConflict, HttpCreated } from "../utils/helpers/http-response-helper";
import { db } from "../db";
import { schemas } from "../db/schemas";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs'
import { calculateGoals } from "../utils/helpers/goal-calculator-helper";
import { signAccessTokenFor } from "../lib/jwt";

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

    const [userAlreadyExists] = await db.select({
      email: schemas.accounts.email
    }).from(schemas.accounts).where(eq(schemas.accounts.email, data.account.email))

    if (userAlreadyExists) {
      return HttpConflict({
        errors: ['User already exists']
      })
    }

    const {account, ...restData} = data

    

    const SALT_ROUNDS = 10
    
    const hashedPassword = await bcrypt.hash(account.password, SALT_ROUNDS)
    
    const goals = calculateGoals({
      ...restData,
      birthDate: new Date(restData.birthDate)
    })
    
    const [user] = await db.insert(schemas.accounts).values({
      ...restData,
      ...account,
      ...goals,
      password: hashedPassword,
    }).returning({
      userId: schemas.accounts.id,
    })

    const accessToken = signAccessTokenFor(user.userId)
    
    return HttpCreated({
      accessToken
    })
  }
}