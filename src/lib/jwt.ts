import { sign, verify, type JwtPayload } from "jsonwebtoken";
import { envConfig } from "../config/env";

export function signAccessTokenFor(userId: string) {
  return sign({
    sub: userId,
  }, envConfig.JWT_SECRET, {
    expiresIn: '3d'
  })
}

export function verifyAccessToken(token: string) {
  try {
    const { sub } = verify(token, envConfig.JWT_SECRET) as JwtPayload  
    return sub ?? null
  } catch {
    return null
  }
}