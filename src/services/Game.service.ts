import dbConnect from "@/lib/mongodb";
import { GameDB, IGame, ICard, GameStatus } from "@/models/Game.model";
import { Types } from "mongoose";

export class GameService {

  static async createGame(userId: Types.ObjectId, deck: ICard[], attempt: number): Promise<string> {
    await dbConnect();

    const game = new GameDB({
      userId,
      deck,
      actions: [],
      status: GameStatus.IN_PROGRESS,
      attempt,
    });

    await game.save();

    return game._id.toString();
  }

  static async countUserGames(userId: Types.ObjectId): Promise<number> {
    await dbConnect();
    return GameDB.countDocuments({ userId });
  }

  static async getLeaderboard(page: number, limit: number): Promise<IGame[]> {
    await dbConnect();
    return GameDB.find().sort({ score: -1 }).skip((page - 1) * limit).populate("userId").limit(limit);
  }

  static async getUserGames(userId: Types.ObjectId): Promise<IGame[]> {
    await dbConnect();
    return GameDB.find({ userId }).sort({ createdAt: -1 });
  }
}
