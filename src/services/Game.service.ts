import { getRedisClient } from "@/lib/redisdb";
import dbConnect from "@/lib/mongodb";
import { GameDB, IGame, ICard, CardStatus, GameActionType, GameStatus } from "@/models/Game.model";
import { Types } from "mongoose";

export class GameService {
  static getRedisKey(gameId: Types.ObjectId) {
    return `game:${gameId}`;
  }

  static async createGame(userId: Types.ObjectId, deck: ICard[]) {
    await dbConnect();

    const game = await GameDB.create({
      userId,
      deck,
      actions: [
        { action: GameActionType.START, timestamp: Date.now() }
      ],
      status: GameStatus.IN_PROGRESS,
    });

    const redis = await getRedisClient();
    await redis.set(
      this.getRedisKey(game._id),
      JSON.stringify(game),
      { EX: 600 }
    );

    return game.toObject();
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
    const game = await GameDB.findById(gameId).lean<IGame>();
    if (game?.userId.toString() !== userId.toString()) throw new Error("Game not found");
    return game;
  }

  static async countUserGames(userId: Types.ObjectId): Promise<number> {
    await dbConnect();
    return GameDB.countDocuments({ userId });
  }

}
