import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

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

export function jwtAuth(request: NextRequest): string | null {
    const userToken = request.cookies.get("userToken")
    if (!userToken) {
        return null
    }
    try {
        const jwtPayload = verifyCookie(userToken.value) as { userId: string }
        if (!jwtPayload.userId) {
            return null
        }
        return jwtPayload.userId
    } catch {
        return null
    }
}