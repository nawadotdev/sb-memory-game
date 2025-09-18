"use client"

import { Score } from "@/models/Game.model"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Card, CardTitle } from './ui/card'
import { useAuth } from "@/context/AuthContext"

const MyGames = () => {

    const [list, setList] = useState<(Score & { createdAt: Date, gameId: string })[]>([])
    const { setPlayedGames } = useAuth()
    useEffect(() => {
        const fetchLeaderboard = async () => {
            const response = await fetch("/api/game", { credentials: "include" })
            const data = await response.json()
            setList(data.scores || [])
            setPlayedGames(data.scores?.length || 0)
        }
        fetchLeaderboard()
    }, [])

    return (
        <Card className='px-4 '>
            <CardTitle className='text-center text-2xl'>
                My Games
            </CardTitle>
            <Table className='text-xl overflow-y-auto max-h-[500px]'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-center'>
                            Score
                        </TableHead>
                        <TableHead className='text-center'>
                            Time
                        </TableHead>
                        <TableHead className='text-center'>
                            Created At
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.length > 0 && list.map((item) => (
                        <TableRow key={crypto.randomUUID()} onClick={() => {
                            window.open(`/game/${item.gameId}`, "_blank")
                        }} className='cursor-pointer'>
                            <TableCell className='text-center'>{item.score}</TableCell>
                            <TableCell className='text-center'>{(item.time?.toFixed(2) || 0)}s</TableCell>
                            <TableCell className='text-center'>{new Date(item.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</TableCell>
                        </TableRow>
                    ))}
                    {list.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} className='text-center'>No data yet</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}

export default MyGames