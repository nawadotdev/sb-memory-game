import { verifyCookie } from "@/lib/jwt"
import { UserService } from "@/services/User.service"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const userToken = request.cookies.get("userToken")
    if (!userToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const userId = verifyCookie(userToken.value) as { userId: string }

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await UserService.getUser(new Types.ObjectId(userId.userId))
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json(user)

}