"use client"

import { Score } from "@/models/Game.model"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Card, CardTitle } from './ui/card'

const MyGames = () => {

    const [list, setList] = useState<(Score & { createdAt: Date, gameId: string })[]>([])

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const response = await fetch("/api/game", { credentials: "include" })
            const data = await response.json()
            setList(data.scores)
        }
        fetchLeaderboard()
    }, [])

    return (
        <Card className='px-4'>
            <CardTitle>
                My Games
            </CardTitle>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Score
                        </TableHead>
                        <TableHead>
                            Time
                        </TableHead>
                        <TableHead>
                            Created At
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.length > 0 && list.map((item) => (
                        <TableRow key={crypto.randomUUID()} onClick={() => {
                            window.open(`/game/${item.gameId}`, "_blank")
                        }} className='cursor-pointer'>
                            <TableCell>{item.score}</TableCell>
                            <TableCell>{(item.time?.toFixed(2) || 0)} seconds</TableCell>
                            <TableCell>{new Date(item.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</TableCell>
                        </TableRow>
                    ))}
                    {list.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className='text-center'>No data yet</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}

export default MyGames