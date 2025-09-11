import { getRedisClient } from "@/lib/redisdb";
import dbConnect from "@/lib/mongodb";
import { GameDB, IGame, GameActionType, GameStatus } from "@/models/Game.model";
import { Types } from "mongoose";

export class GameService {
    static getRedisKey(gameId: Types.ObjectId) {
        return `game:${gameId}`;
    }

    static async createGame(userId: Types.ObjectId, deck: number[]) {
        await dbConnect();
        const game = await GameDB.create({
            userId,
            deck,
            status: GameStatus.STARTED,
            score: 0,
            actions: [
                { action: GameActionType.START, timestamp: Date.now() }
            ]
        });

        const redis = await getRedisClient();
        await redis.set(
            this.getRedisKey(game._id),
            JSON.stringify(game),
            { EX: 600 }
        );

        return game;
    }

    static async getGame(gameId: Types.ObjectId, userId: Types.ObjectId): Promise<IGame | null> {
        const redis = await getRedisClient();
        const data = await redis.get(this.getRedisKey(gameId));
        if (data) {
            const game = JSON.parse(data) as IGame;
            if (game.userId.toString() !== userId.toString()) throw new Error("Game not found");
            return game;
        }

        await dbConnect();
        const game = await GameDB.findById(gameId);
        if (game?.userId.toString() !== userId.toString()) throw new Error("Game not found");
        return game as IGame;
    }

    static async flipCard(gameId: Types.ObjectId, cardIndex: number, userId: Types.ObjectId) {
        const redis = await getRedisClient();

        const lockKey = `lock:game:${gameId}`;
        const acquired = await redis.set(lockKey, userId.toString(), { NX: true, EX: 2 });
        if (!acquired) {
            throw new Error("Another flip in progress, try again.");
        }

        try {
            const game = await this.getGame(gameId, userId);
            if (!game) throw new Error("Game not found");

            game.actions.push({
                action: GameActionType.FLIP,
                timestamp: Date.now(),
                cardIndex,
            });

            const recentFlips = game.actions.filter(a => a.action === GameActionType.FLIP).slice(-2);
            if (recentFlips.length === 2) {
                const [first, second] = recentFlips;
                const card1 = game.deck[first.cardIndex!];
                const card2 = game.deck[second.cardIndex!];

                if (card1 === card2) {
                    game.actions.push({
                        action: GameActionType.MATCH,
                        timestamp: Date.now(),
                        matchedCardIndex: [first.cardIndex!, second.cardIndex!]
                    });
                    game.score += 1;
                }
            }

            await redis.set(this.getRedisKey(game._id), JSON.stringify(game), { EX: 600 });
            return game;
        } finally {
            await redis.del(lockKey);
        }
    }

    static async endGame(gameId: Types.ObjectId, userId: Types.ObjectId) {
        const redis = await getRedisClient();
        const game = await this.getGame(gameId, userId);
        if (!game) return null;

        game.status = GameStatus.ENDED;
        game.actions.push({
            action: GameActionType.END,
            timestamp: Date.now(),
        });

        await dbConnect();
        const saved = await GameDB.findByIdAndUpdate(gameId, game, { new: true });
        await redis.del(this.getRedisKey(gameId));

        return saved;
    }
}
