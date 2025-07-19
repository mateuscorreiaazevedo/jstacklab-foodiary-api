import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { HttpRequest, ProtectedHttpRequest } from "../../types/http";
import { EMPTY_OBJECT, EMPTY_OBJECT_STRING } from "../constants/empty-object-constant";
import { verifyAccessToken } from "../../lib/jwt";

export function parseEventHelper(event: APIGatewayProxyEventV2): HttpRequest {
  return {
    body: JSON.parse(event.body ?? EMPTY_OBJECT_STRING),
        queryParams: event.queryStringParameters ?? EMPTY_OBJECT,
        params: event.pathParameters ?? EMPTY_OBJECT,
  }
}

export function parseProtectedEventHelper(event: APIGatewayProxyEventV2): ProtectedHttpRequest {
  const baseEvent = parseEventHelper(event)
  
  const {authorization} = event.headers

  if (!authorization) {
    throw new Error('Unauthorized: Access token not provided.')
  }

  const [, token] = authorization.split(' ')

  const userId = verifyAccessToken(token)

  if (!userId) {
    throw new Error('Unauthorized: Invalid access token.')
  }
  
  return {
    ...baseEvent,
    userId
  }
}