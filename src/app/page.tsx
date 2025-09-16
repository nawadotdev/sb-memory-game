import PlayButton from "@/components/Game/PlayButton";
import Leaderboard from "@/components/Leaderboard";
import MyGames from "@/components/MyGames";
import { Button } from "@/components/ui/button";
import { FlameIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-center min-h-screen py-2">
      <Leaderboard />
      <div className="flex gap-4">
        <PlayButton />
        <Link href="/burn">
          <Button className="cursor-pointer" variant={"destructive"}>
            <FlameIcon className="size-4" />
            Burn
          </Button>
        </Link>
      </div>
      <MyGames />

    </div>
  );
}
