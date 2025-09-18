import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SocialIcon } from 'react-social-icons'

const Footer = () => {
    return (
        <footer className="w-full bg-solbabe-purple text-white py-6 px-4 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 md:h-[1rem] h-[8rem]">
                {/* Sol */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Sol Babes"
                        width={40}
                        height={40}
                    />
                </div>

                {/* Orta */}
                <div className="text-center text-xs flex-1 items-center justify-center">
                    Built by{" "}
                    <Link
                        href="https://x.com/nawadotdev"
                        target="_blank"
                        className="text-blue-400 hover:underline"
                    >
                        Nawa
                    </Link>{" "}
                    for SolBabes
                </div>

                {/* Sağ */}
                <div className="flex flex-row items-center gap-6">
                    <Link
                        href="https://x.com/solana_babes"
                        target="_blank"
                        className="flex items-center gap-2"
                    >
                        <SocialIcon
                            network="x"
                            style={{ width: "20px", height: "20px" }}
                            label="SolBabes X"
                            className="cursor-pointer"
                        />
                        <span className="text-xs">/solana_babes</span>
                    </Link>

                    <Link
                        href="https://discord.gg/bjbGXn5ShN"
                        target="_blank"
                        className="flex items-center gap-2"
                    >
                        <SocialIcon
                            url="https://discord.gg/bjbGXn5ShN"
                            network="discord"
                            style={{ width: "20px", height: "20px" }}
                            label="SolBabes Discord"
                            className="cursor-pointer"
                        />
                        <span className="text-xs">/bjbGXn5ShN</span>
                    </Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer
