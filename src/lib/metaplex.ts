import { Connection } from "@solana/web3.js"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { burnV1, fetchDigitalAssetWithAssociatedToken, findMetadataPda, mplTokenMetadata, TokenStandard } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, publicKey, unwrapOption } from "@metaplex-foundation/umi";

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY

export const connection = new Connection(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`);

const umi = createUmi(connection).use(mplTokenMetadata())
const signer = generateSigner(umi)
umi.use(keypairIdentity(signer))

export const getBurnInstruction = async (nftId: string, wallet: string) => {

    const mintId = publicKey(nftId)
    const walletId = publicKey(wallet)

    const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
        umi,
        mintId,
        walletId
    )

    const collectionMint = unwrapOption(assetWithToken.metadata.collection)

    const collectionMetadata = collectionMint
        ? findMetadataPda(umi, { mint: collectionMint.key })
        : null

    const res = burnV1(umi, {
        mint: mintId,
        collectionMetadata: collectionMetadata || undefined,
        token: assetWithToken.token.publicKey,
        tokenRecord: assetWithToken.tokenRecord?.publicKey,
        tokenStandard: TokenStandard.ProgrammableNonFungible,
    }).getInstructions()

    return res[0]

}