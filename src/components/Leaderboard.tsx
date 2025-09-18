"use client"

import { Score } from '@/models/Game.model'
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import Image from 'next/image'
import { Card, CardTitle } from './ui/card'

const Leaderboard = () => {

    const [list, setList] = useState<Score[]>([])

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const response = await fetch("/api/leaderboard")
            const data = await response.json()
            const scores = data.scores.filter((score: Score) => score.time && score.time > 0).sort((a: Score, b: Score) => b.score - a.score)
            const sortedScores = scores.sort((a: Score, b: Score) => {
                if (a.score === b.score) {
                    return a.time! - b.time!
                }
                return b.score - a.score
            })
            setList(sortedScores)
        }
        fetchLeaderboard()
    }, [])

    return (
        <Card className='px-4'>
            <CardTitle className='text-center text-2xl'>
                Leaderboard
            </CardTitle>
            <Table className='text-xl'>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-center'>
                            Rank
                        </TableHead>
                        <TableHead className='text-center'>
                            Discord
                        </TableHead>
                        <TableHead className='text-center'>
                            Score
                        </TableHead>
                        <TableHead className='text-center'>
                            Time
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.length > 0 && list.map((item, index) => (
                        <TableRow key={crypto.randomUUID()}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className='flex items-center gap-2 text-center'>
                                <Image src={item.avatar ? `https://cdn.discordapp.com/avatars/${item.discordId}/${item.avatar}` : '/discord.png'} alt='Discord Avatar' width={20} height={20} className='rounded-full' onError={(e) => {
                                    e.currentTarget.src = '/discord.png'
                                }} />
                                {item.username}
                            </TableCell>
                            <TableCell className='text-center'>{item.score}</TableCell>
                            <TableCell className='text-center'>{(item.time?.toFixed(2) || 0)}s</TableCell>
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

export default Leaderboard