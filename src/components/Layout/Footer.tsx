import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SocialIcon } from 'react-social-icons'

const Footer = () => {
    return (
        <footer className="w-full bg-solbabe-purple text-white py-4 px-8 border-t border-white/20 h-[3rem] flex items-center">
            <div className="relative flex items-center w-full">
                <div className="absolute left-0">
                    <Image
                        src="/logo.png"
                        alt="Sol Babes"
                        width={40}
                        height={40}
                    />
                </div>

                <div className="mx-auto">
                    <p className="text-xs text-center">Built by <Link href={"https://x.com/nawadotdev"} target='_blank' className='text-blue-600'>Nawa</Link> for SolBabes</p>
                </div>

                {/* Sağ */}
                <div className="absolute right-0 flex flex-row gap-8">
                    <Link href='https://x.com/solana_babes' target='_blank' className='flex items-center gap-2'>
                        <SocialIcon network='x' style={{ width: '20px', height: '20px' }} label='SolBabes X' className='cursor-pointer' />
                        <span className='text-xs'>SolBabes X</span>
                    </Link>

                    <Link href='https://discord.gg/bjbGXn5ShN' target='_blank' className='flex items-center gap-2'>
                        <SocialIcon url='https://discord.gg/bjbGXn5ShN' network='discord' style={{ width: '20px', height: '20px' }} label='SolBabes Discord' className='cursor-pointer' />
                        <span className='text-xs'>SolBabes Discord</span>
                    </Link>
                </div>
            </div>
        </footer >

    )
}

export default Footer