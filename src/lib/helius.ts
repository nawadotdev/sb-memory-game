const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY

export const getNfts = async (wallet: string) => {
    if (!HELIUS_API_KEY) {
        throw new Error("HELIUS_API_KEY is not set")
    }

    const response = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
        method: "POST",
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getAssetsByOwner",
            params: { ownerAddress: wallet }
        })
    })

    if (!response.ok) {
        throw new Error("Failed to fetch NFTs: " + response.statusText)
    }

    const data = await response.json()
    if (data.error) {
        throw new Error("Failed to fetch NFTs: " + data.error.message)
    }

    return data.result.items.filter((item: { grouping: { group_value: string }[] }) => item.grouping?.[0]?.group_value === "3tsTwMmykKG3Q2bwrTdJB3dadenXXKdjaJcb9YTgLFZp")
}