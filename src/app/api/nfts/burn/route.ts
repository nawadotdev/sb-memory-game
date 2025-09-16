import { jwtAuth, jwtSignMemo } from "@/lib/jwt"
import { UserService } from "@/services/User.service"
import { NextRequest, NextResponse } from "next/server"
import { Types } from "mongoose"
import { PublicKey, TransactionInstruction } from "@solana/web3.js"
import { getBurnInstruction } from "@/lib/metaplex"

export async function POST(request: NextRequest) {
    const userId = jwtAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await UserService.getUser(new Types.ObjectId(userId))
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const {nftIds, wallet} = await request.json()
    if (!nftIds || !wallet) {
        return NextResponse.json({ error: "NFT IDs and wallet are required" }, { status: 400 })
    }

    if(nftIds.length > 2) {
        return NextResponse.json({ error: "You can only burn up to 2 NFTs" }, { status: 400 })
    }

    try{
        new PublicKey(wallet)
    } catch {
        return NextResponse.json({ error: "Invalid wallet" }, { status: 400 })
    }

    const ixs = await Promise.all(nftIds.map(async (nftId: string) => {
        return await getBurnInstruction(nftId, wallet)
    })) 


    const decodedIxs = (ixs.map(ix => {
        return {
            keys: ix.keys.map((key: { pubkey: PublicKey, isSigner: boolean, isWritable: boolean }, index: number) => ({
                pubkey: index === 0 ? wallet : key.pubkey.toString(),
                isSigner: key.isSigner,
                isWritable: key.isWritable
            })),
            programId: ix.programId.toString(),
            data: Array.from(ix.data)
        }
    }))

    const memo = new TransactionInstruction({
        keys: [],
        programId: new PublicKey("Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo"),
        data: Buffer.from(JSON.stringify(jwtSignMemo(wallet, nftIds, user._id.toString())))
    })

    return NextResponse.json([...decodedIxs, memo])

}