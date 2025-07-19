import { sign } from "jsonwebtoken";
import { envConfig } from "../config/env";

export function signAccessTokenFor(userId: string) {
  return sign({
    sub: userId,
  }, envConfig.JWT_SECRET, {
    expiresIn: '3d'
  })
}