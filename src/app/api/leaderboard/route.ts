import { GameActionType, IGame, Score } from "@/models/Game.model"
import { IUser } from "@/models/User.model"
import { GameService } from "@/services/Game.service"
import { NextRequest, NextResponse } from "next/server"

export const GET = async (request: NextRequest) => {

    const page = request.nextUrl.searchParams.get("page") || 1
    const limit = request.nextUrl.searchParams.get("limit") || 10

    const list = await GameService.getLeaderboard(Number(page), Number(limit))

    const scores: Score[] = list.map((game: IGame) => {
        const user = game.userId as unknown as IUser
        const timestart = game.actions.find((action) => action.action === GameActionType.START)?.timestamp || 0
        const timeend = game.actions.find((action) => action.action === GameActionType.END)?.timestamp || 0
        const time = timeend - timestart
        return {
            username: user.discordUsername,
            score: game.score,
            time: time / 1000,
            avatar: user.avatar,
            discordId: user.discordId.toString(),
        }
    })

    return NextResponse.json({ scores })
    
}