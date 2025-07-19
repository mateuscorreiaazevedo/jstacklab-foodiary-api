import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { SignInController } from "../controllers/singin-controller";
import { EMPTY_OBJECT, EMPTY_OBJECT_STRING } from "../utils/constants/empty-object-constant";
import { parseEventHelper } from "../utils/helpers/parse-event-helper";
import { parseResponseHelper } from "../utils/helpers/parse-response-helper";

export async function handler(event: APIGatewayProxyEventV2) {
  const parseEvent = parseEventHelper(event)
  
  const signInResponse = await SignInController.handle(parseEvent)

  return parseResponseHelper(signInResponse)
}