"use client"

import { useAuth } from '@/context/AuthContext'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React, { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { CheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'

const NftCard = ({ nft, selectNft, deselectNft, selected }: { nft: INft, selectNft: (nftId: string) => void, deselectNft: (nftId: string) => void, selected: boolean }) => {

    const handleSelect = () => {
        if (selected) {
            deselectNft(nft.id)
        } else {
            selectNft(nft.id)
        }
    }

    return (
        <Card className='pt-0 relative cursor-pointer' onClick={handleSelect}>
            <CardContent className='p-0'>
                <Image src={nft.content.files[0].uri} alt={nft.id} width={400} height={400} className='rounded-t-md w-64 h-64' />
            </CardContent>
            <CardFooter>
                <p className='text-center w-full'>{nft.content.metadata.name}</p>
            </CardFooter>
            <div className='w-12 h-12 absolute top-6 left-6 border rounded-md flex items-center justify-center'>
                {selected && <CheckIcon className='w-6 h-6' />}
            </div>
        </Card>
    )
}

interface INft {
    id: string
    content: {
        files: [{
            uri: string
        }],
        metadata: {
            name: string
        }
    },

}

const Page = () => {

    const connection = useConnection()
    const { user } = useAuth()
    const { publicKey, signTransaction, sendTransaction } = useWallet()
    const [nfts, setNfts] = useState<INft[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedNfts, setSelectedNfts] = useState<string[]>([])
    const [burning, setBurning] = useState(false)

    const selectNft = useCallback((nftId: string) => {
        if (selectedNfts.length >= 2) {
            toast.error("You can only select up to 2 NFTs")
            return
        }
        setSelectedNfts((prev) => [...prev, nftId])
    }, [setSelectedNfts, selectedNfts])

    const deselectNft = useCallback((nftId: string) => {
        setSelectedNfts((prev) => prev.filter((nft) => nft !== nftId))
    }, [setSelectedNfts])

    const fetchNfts = useCallback(async () => {
        if (!publicKey || !user) return
        setLoading(true)
        try {
            const response = await fetch(`/api/nfts?wallet=${publicKey.toString()}`, { credentials: "include" })
            const data = await response.json()

            if (response.ok) {
            } else throw new Error(data.error || "Failed to fetch NFTs")

            setNfts(data.nfts)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to fetch NFTs")
        } finally {
            setLoading(false)
        }

    }, [publicKey, user])

    useEffect(() => {
        fetchNfts()
    }, [publicKey, fetchNfts])

    const handleBurn = async () => {
        setBurning(true)
        const toastId = toast.loading("Creating burn transaction...")
        try {
            if (!publicKey) throw new Error("Please connect your wallet")

            const response = await fetch('/api/nfts/burn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({
                    nftIds: selectedNfts,
                    wallet: publicKey?.toString()
                })
            })

            const data = await response.json()
            if (response.ok) {
                const ixs = data
                if (!ixs) throw new Error("Failed to create burn transaction")
                if (!signTransaction) throw new Error("Failed to sign transaction")
                const transaction = new Transaction()
                ixs.forEach((ix: { keys: { pubkey: string, isSigner: boolean, isWritable: boolean }[], programId: string, data: string }) => {
                    transaction.add(new TransactionInstruction({
                        keys: ix.keys.map((k: { pubkey: string, isSigner: boolean, isWritable: boolean }) => ({
                            pubkey: new PublicKey(k.pubkey),
                            isSigner: k.isSigner,
                            isWritable: k.isWritable
                        })),
                        programId: new PublicKey(ix.programId),
                        data: Buffer.from(ix.data)
                    }))
                })
                transaction.feePayer = publicKey
                const { blockhash, lastValidBlockHeight } = await connection.connection.getLatestBlockhash()
                transaction.recentBlockhash = blockhash

                const sig = await sendTransaction(transaction, connection.connection)

                toast.loading("Burning NFTs...", { id: toastId })

                try {
                    const confirmation = await connection.connection.confirmTransaction({
                        blockhash,
                        lastValidBlockHeight,
                        signature: sig
                    })

                    if (confirmation.value.err) {
                        throw new Error(`Transaction failed`)
                    }


                } catch (error) {
                    throw new Error(error instanceof Error ? error.message : "Failed to burn NFTs")
                }

                toast.loading("Confirming burn...", { id: toastId })

                const resp = await fetch("api/nfts/burn/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        signature: sig
                    })
                })

                if (resp.ok) {
                    toast.success("Burn successful", { id: toastId })
                    fetchNfts()
                    setSelectedNfts([])
                } else {
                    toast.error(resp.statusText || "Failed to confirm burn", { id: toastId })
                    throw new Error(resp.statusText || "Failed to confirm burn")
                }

            } else {
                toast.error(data.error || "Failed to create burn transaction", { id: toastId })
                throw new Error(data.error || "Failed to create burn transaction")
            }

        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to burn NFTs", { id: toastId })
        } finally {
            setBurning(false)
        }
    }


    return (
        <div className='min-h-screen flex items-center justify-start p-4 gap-4 flex-col'>
            {!user ? <p>Please login to view your NFTs</p> :
                (
                    <div className='flex flex-col items-center justify-center gap-4'>
                        <WalletMultiButton className='flex' />
                        {!publicKey && <p>Please connect your wallet</p>}
                    </div>
                )
            }
            <Button disabled={selectedNfts.length === 0 || burning} variant={"destructive"} onClick={handleBurn} className='cursor-pointer'>Burn</Button>
            {/* NFTs */}
            <div className='flex flex-col items-center justify-center gap-4'>
                <h2>Your NFTs</h2>
                {loading ? <p>Loading...</p> :
                    <div className='flex flex-wrap gap-4 justify-center'>
                        {nfts.map((nft) => (
                            <NftCard key={nft.id} nft={nft} selectNft={selectNft} deselectNft={deselectNft} selected={selectedNfts.includes(nft.id)} />
                        ))}
                    </div>
                }
            </div>

        </div>
    )
}

export default Page