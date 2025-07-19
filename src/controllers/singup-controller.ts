import z from "zod";
import type { HttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpCreated } from "../utils/helpers/http-response-helper";


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

    return HttpCreated({
      data
    })
  }
}