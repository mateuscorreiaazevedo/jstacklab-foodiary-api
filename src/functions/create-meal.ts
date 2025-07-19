import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseProtectedEventHelper } from "../utils/helpers/parse-event-helper";
import { parseResponseHelper } from "../utils/helpers/parse-response-helper";
import { CreateMealController } from "../controllers/create-meal-controller";

export async function handler(event: APIGatewayProxyEventV2) {
  const parseEvent = parseProtectedEventHelper(event)
  
  const createMealResponse = await CreateMealController.handle(parseEvent)

  return parseResponseHelper(createMealResponse)
}