import type { HttpRequest, HttpResponse } from "../types/http";
import { HttpOk } from "../utils/helpers/http-response-helper";

export class SignInController {
  static async handle(req: HttpRequest): Promise<HttpResponse> {

    await Promise.resolve()
    
    return HttpOk({
      accessToken: 'signIn: token'
    })
  }
}