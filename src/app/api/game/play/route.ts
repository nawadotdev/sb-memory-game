import { generateDeck } from "@/lib/game";
import { jwtAuth } from "@/lib/jwt";
import { getGameRights } from "@/models/User.model";
import { toSafeGame } from "@/models/Game.model";
import { GameService } from "@/services/Game.service";
import { UserService } from "@/services/User.service";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const userId = jwtAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await UserService.getUser(new Types.ObjectId(userId))
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const gameRights = getGameRights(user)
    const userGames = await GameService.countUserGames(new Types.ObjectId(userId))

    if (userGames >= gameRights) {
        return NextResponse.json({ error: "You have reached the maximum number of games" }, { status: 400 })
    }

    const deck = generateDeck()

    const game = await GameService.createGame(new Types.ObjectId(userId), deck)

    return NextResponse.json(toSafeGame(game))
    
}