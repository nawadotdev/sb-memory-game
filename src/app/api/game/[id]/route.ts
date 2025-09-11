import { jwtAuth } from "@/lib/jwt";
import { toSafeGame } from "@/models/Game.model";
import { GameService } from "@/services/Game.service";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const userId = jwtAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params;
    const game = await GameService.getGame(new Types.ObjectId(id), new Types.ObjectId(userId))
    if (!game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }


    return NextResponse.json(toSafeGame(game))
}