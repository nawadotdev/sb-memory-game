import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const signState = (state: string) => {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    return jwt.sign(state, JWT_SECRET);
}

export function verifyCookie(token: string) {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    return jwt.verify(token, JWT_SECRET)
}

export function signUserId(userId: string) {
    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not set");
    }
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}