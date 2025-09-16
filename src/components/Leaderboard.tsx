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
            setList(data.scores)
        }
        fetchLeaderboard()
    }, [])

    return (
        <Card className='px-4'>
            <CardTitle>
                Leaderboard
            </CardTitle>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Rank
                        </TableHead>
                        <TableHead>
                            Username
                        </TableHead>
                        <TableHead>
                            Score
                        </TableHead>
                        <TableHead>
                            Time
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.length > 0 && list.map((item, index) => (
                        <TableRow key={crypto.randomUUID()}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className='flex items-center gap-2'>
                                <Image src={item.avatar ? `https://cdn.discordapp.com/avatars/${item.discordId}/${item.avatar}` : '/discord.png'} alt='Discord Avatar' width={20} height={20} className='rounded-full' onError={(e) => {
                                    e.currentTarget.src = '/discord.png'
                                }} />
                                {item.username}
                            </TableCell>
                            <TableCell>{item.score}</TableCell>
                            <TableCell>{(item.time?.toFixed(2) || 0)} seconds</TableCell>
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