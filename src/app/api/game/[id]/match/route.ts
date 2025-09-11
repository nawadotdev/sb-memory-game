import { jwtAuth } from "@/lib/jwt"
import { toSafeGame } from "@/models/Game.model"
import { GameService } from "@/services/Game.service"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"


export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = jwtAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params

    const game = await GameService.matchCards(new Types.ObjectId(id), new Types.ObjectId(userId))

    return NextResponse.json(toSafeGame(game))

}