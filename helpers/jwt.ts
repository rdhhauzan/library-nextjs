import jwt from "jsonwebtoken";

interface Payload {
  userId: string;
}

const createToken = (payload: Payload): string => jwt.sign(payload, "secret");
const verifyToken = (token: string): Payload => jwt.verify(token, "secret") as Payload;

export { createToken, verifyToken };
