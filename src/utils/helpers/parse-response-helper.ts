import type { HttpResponse } from "../../types/http";

export function parseResponseHelper({statusCode, body}: HttpResponse) {
  return {
    statusCode,
    body: body ? JSON.stringify(body) : undefined,
  }
}