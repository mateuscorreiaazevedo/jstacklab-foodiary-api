import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { SignUpController } from "../controllers/singup-controller";
import { parseEventHelper } from "../utils/helpers/parse-event-helper";
import { parseResponseHelper } from "../utils/helpers/parse-response-helper";

export async function handler(event: APIGatewayProxyEventV2) {
  const parseEvent = parseEventHelper(event)  
  
  const signUpResponse = await SignUpController.handle(parseEvent)

  return parseResponseHelper(signUpResponse)
}