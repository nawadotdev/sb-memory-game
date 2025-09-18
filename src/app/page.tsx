"use client"

import PlayButton from "@/components/Game/PlayButton";
import DiscordButton from "@/components/Layout/DiscordButton";
import Leaderboard from "@/components/Leaderboard";
import MyGames from "@/components/MyGames";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { FlameIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function Home() {

  const { user, isAuthenticating, userRights } = useAuth()
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-evenly min-h-screen py-2">
      {isAuthenticating ? <p><Loader2 className="animate-spin" /></p> :
        user ? (
          <>
            <Leaderboard />
            <div className="flex flex-col gap-4 items-center justify-center">
              <div className="flex flex-col gap-2 items-center justify-center">
                <PlayButton />
                {userRights && <p className="text-xs text-muted">You can play {userRights} times.</p>}
              </div>
              <Link href="/burn">
                <Button className="cursor-pointer" size={"lg"} variant={"destructive"}>
                  <FlameIcon className="size-4" />
                  Burn
                </Button>
              </Link>
            </div>
            <MyGames />
          </>
        ) : <p><DiscordButton textHidden={false} /></p>}
    </div>
  );
}
