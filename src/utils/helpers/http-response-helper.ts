import type { HttpResponse } from "../../types/http";

export function HttpOk(body?: Record<string, any>): HttpResponse {
  return {
    statusCode: 200,
    body,
  }
}

export function HttpCreated(body?: Record<string, any>): HttpResponse {
  return {
    statusCode: 201,
    body,
  }
}

export function HttpBadRequest(body?: Record<string, any>): HttpResponse {
  return {
    statusCode: 400,
    body,
  }
}

export function HttpUnauthorized(body?: Record<string, any>): HttpResponse {
  return {
    statusCode: 401,
    body,
  }
}

export function HttpConflict(body?: Record<string, any>): HttpResponse {
  return {
    statusCode: 409,
    body,
  }
}
  