import { jwtAuth } from "@/lib/jwt"
import { GameActionType, IGame, MyGame } from "@/models/Game.model"
import { IUser } from "@/models/User.model"
import { GameService } from "@/services/Game.service"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const userId = jwtAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userGames = await GameService.getUserGames(new Types.ObjectId(userId))
    const scores: MyGame[] = userGames.map((game: IGame) => {
        const timestart = game.actions.find((action) => action.action === GameActionType.START)?.timestamp || 0
        const timeend = game.actions.find((action) => action.action === GameActionType.END)?.timestamp || 0
        const time = timeend - timestart
        return {
            score: game.score,
            time: time / 1000,
            gameId: game._id.toString(),
            createdAt: game.createdAt,
        }
    })


    return NextResponse.json({ scores })
}