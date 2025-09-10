import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const response = NextResponse.redirect(new URL("/", request.url))
    response.cookies.set("userToken", "", { maxAge: 0, path: "/" })
    response.cookies.set("clientState", "", { maxAge: 0, path: "/" })
    return response
}