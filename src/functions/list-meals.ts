import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseProtectedEventHelper } from "../utils/helpers/parse-event-helper";
import { parseResponseHelper } from "../utils/helpers/parse-response-helper";
import { ListMealsController } from "../controllers/list-meals-controller";

export async function handler(event: APIGatewayProxyEventV2) {
  const parseEvent = parseProtectedEventHelper(event)
  
  const listMealsResponse = await ListMealsController.handle(parseEvent)

  return parseResponseHelper(listMealsResponse)
}