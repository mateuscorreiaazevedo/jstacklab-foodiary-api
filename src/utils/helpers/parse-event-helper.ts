import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { HttpRequest } from "../../types/http";
import { EMPTY_OBJECT, EMPTY_OBJECT_STRING } from "../constants/empty-object-constant";

export function parseEventHelper(event: APIGatewayProxyEventV2): HttpRequest {
  return {
    body: JSON.parse(event.body ?? EMPTY_OBJECT_STRING),
        queryParams: event.queryStringParameters ?? EMPTY_OBJECT,
        params: event.pathParameters ?? EMPTY_OBJECT,
  }
}