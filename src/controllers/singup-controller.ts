import type { HttpRequest, HttpResponse } from "../types/http";
import { HttpCreated } from "../utils/helpers/http-response-helper";

export class SignUpController {
  static async handle(req: HttpRequest): Promise<HttpResponse> {
    await Promise.resolve()
    
    return HttpCreated({
      accessToken: 'SignUp: token'
    })
  }
}