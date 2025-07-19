import z from "zod";
import type { HttpRequest, HttpResponse } from "../types/http";
import { HttpBadRequest, HttpOk } from "../utils/helpers/http-response-helper";

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
    
    return HttpOk({
      data
    })
  }
}