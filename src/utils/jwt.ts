import jwt, { type SignOptions } from "jsonwebtoken";
import env from "../config/env.js";

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

type TokenUser = {
  id: string;
  email: string;
};

export function signAccessToken(user: TokenUser): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    env.jwtSecret,
    options,
  );
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, env.jwtSecret);

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.sub !== "string" ||
    typeof decoded.email !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    email: decoded.email,
  };
}
