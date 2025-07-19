import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { EMPTY_OBJECT, EMPTY_OBJECT_STRING } from "../utils/constants/empty-object-constant";
import { parseProtectedEventHelper } from "../utils/helpers/parse-event-helper";
import { parseResponseHelper } from "../utils/helpers/parse-response-helper";
import { MeController } from "../controllers/me-controller";

export async function handler(event: APIGatewayProxyEventV2) {
  const parseEvent = parseProtectedEventHelper(event)
  
  const meResponse = await MeController.handle(parseEvent)

  return parseResponseHelper(meResponse)
}