import { getOAuthToken, getUserData } from "@/lib/discord"
import { signUserId, verifyCookie } from "@/lib/jwt"
import { IUser } from "@/models/User.model"
import { UserService } from "@/services/User.service"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const clientState = request.cookies.get("clientState")
    const code = request.nextUrl.searchParams.get("code")
    const state = request.nextUrl.searchParams.get("state")

    if (!code || !state || !clientState) {
        return NextResponse.json({ error: 'Missing code or state or client state' }, { status: 400 })
    }
    try {
        const decodedState = verifyCookie(clientState.value)
        if (decodedState !== state) {
            return NextResponse.json({ error: 'State mismatch' }, { status: 401 })
        }
    } catch {
        return NextResponse.json({ error: 'Invalid client state' }, { status: 401 })
    }

    try {
        const tokens = await getOAuthToken(code)


        const me = await getUserData(tokens.access_token)
        const discordId: string | undefined = me.user.id
        if (!discordId) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
        }

        let user: IUser
        try {
            user = await UserService.findOrCreate(discordId, me.user.username, me.user.avatar ?? undefined)
        } catch {
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }

        const userToken = signUserId(user._id.toString())
        const response = NextResponse.redirect(new URL("/", request.url), { status: 303 })
        response.cookies.set("userToken", userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        })
        response.cookies.set("clientState", "", { maxAge: 0, path: "/" })
        return response
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}