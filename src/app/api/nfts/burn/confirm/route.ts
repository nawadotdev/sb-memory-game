import { jwtAuth, jwtParseMemo } from "@/lib/jwt"
import { connection } from "@/lib/metaplex"
import { UserService } from "@/services/User.service"
import { ParsedInstruction, PartiallyDecodedInstruction } from "@solana/web3.js"
import { Types } from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (request: NextRequest) => {

    const userId = jwtAuth(request)
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { signature } = await request.json()

    if(!signature) {
        return NextResponse.json({ error: "Signature is required" }, { status: 400 })
    }

    let tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: "confirmed"})

    if(!tx) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        tx = await connection.getParsedTransaction(signature, { maxSupportedTransactionVersion: 0, commitment: "confirmed"})
    }

    if(!tx) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    const memo = tx.transaction.message.instructions.find((ix) => ix.programId.toString() === "Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo")
    
    if(!memo) {
        return NextResponse.json({ error: "Memo not found" }, { status: 404 })
    }

    const data = (memo as ParsedInstruction).parsed
    const dataWithoutQuotes = data.replace(/^"|"$/g, '')
    const { wallet, mintIds, userId: memoUserId } = jwtParseMemo(dataWithoutQuotes)
    
    if(memoUserId !== userId) {
        return NextResponse.json({ error: "User ID does not match" }, { status: 400 })
    }

    const burnedNfts = []
    let burnerWallet = ""

    for(const ix of tx.transaction.message.instructions) {
        if(ix.programId.toString() !== "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s") continue
        const accounts = (ix as PartiallyDecodedInstruction).accounts
        const mint = accounts[4]
        burnedNfts.push(mint.toString())
        burnerWallet = accounts[0].toString()
    }

    if(burnerWallet !== wallet) {
        return NextResponse.json({ error: "Burner wallet does not match" }, { status: 400 })
    }

    for(const nft of mintIds) {
        if(!burnedNfts.includes(nft)) {
            return NextResponse.json({ error: "Burned NFTs do not match" }, { status: 400 })
        }
    }

    try{
        await UserService.addBurnedNft(new Types.ObjectId(userId), burnedNfts)
    } catch {
        return NextResponse.json({ error: "Failed to add burned NFTs" }, { status: 500 })
    }

    return NextResponse.json({ message: "Burned NFTs added successfully" }, { status: 200 })

}