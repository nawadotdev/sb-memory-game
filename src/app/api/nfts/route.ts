import { getNfts } from "@/lib/helius";
import { jwtAuth } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const userId = jwtAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


    const wallet = request.nextUrl.searchParams.get("wallet")
    if (!wallet) {
        return NextResponse.json({ error: "Wallet is required" }, { status: 400 })
    }

    const nfts = await getNfts(wallet)
    return NextResponse.json({nfts})

    
}