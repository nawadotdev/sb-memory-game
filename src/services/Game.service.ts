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

  static async flipCard(gameId: Types.ObjectId, cardIndex: number, userId: Types.ObjectId) {
    await dbConnect();
    const redis = await getRedisClient();
    const lockKey = `lock:game:${gameId}`;
    const acquired = await redis.set(lockKey, userId.toString(), { NX: true, EX: 2 });
    if (!acquired) throw new Error("Another flip in progress, try again.");

    try {
      const game = await this.getGame(gameId, userId);
      if (!game) throw new Error("Game not found");
      if (game.status !== GameStatus.IN_PROGRESS) throw new Error("Game is not in progress");

      const card = game.deck[cardIndex];
      if (!card) throw new Error("Invalid card index");
      if (card.status !== CardStatus.HIDDEN) throw new Error("Card already flipped or matched");

      const flipped = game.deck.filter(c => c.status === CardStatus.FLIPPED);
      if (flipped.length >= 2) throw new Error("Already 2 cards flipped");

      card.status = CardStatus.FLIPPED;
      const action = {
        action: GameActionType.FLIP,
        timestamp: Date.now(),
        cardIndex,
      };
      game.actions.push(action);

      await redis.set(this.getRedisKey(game._id), JSON.stringify(game), { EX: 600 });

      // await GameDB.updateOne(
      //   { _id: gameId },
      //   { $push: { actions: action } }
      // );

      // if (game.actions.length % 5 === 0) {
      //   await GameDB.updateOne(
      //     { _id: gameId },
      //     { $set: { deck: game.deck, status: game.status } }
      //   );
      // }

      return game;
    } finally {
      await redis.del(lockKey);
    }
  }



  static async matchCards(gameId: Types.ObjectId, userId: Types.ObjectId) {
    await dbConnect();
    const redis = await getRedisClient();
    const game = await this.getGame(gameId, userId);
    if (!game) throw new Error("Game not found");
    if (game.status !== GameStatus.IN_PROGRESS) throw new Error("Game is not in progress");

    const flipped = game.deck.filter(c => c.status === CardStatus.FLIPPED);
    if (flipped.length !== 2) throw new Error("Need exactly 2 flipped cards");

    const [first, second] = flipped;

    if (first.value === second.value) {
      first.status = CardStatus.FOUND;
      second.status = CardStatus.FOUND;
      game.actions.push({
        action: GameActionType.MATCH,
        timestamp: Date.now(),
        matchedCardIndex: [first.index, second.index],
      });
    } else {
      first.status = CardStatus.HIDDEN;
      second.status = CardStatus.HIDDEN;
    }

    if (game.deck.every(c => c.status === CardStatus.FOUND)) {
      game.status = GameStatus.COMPLETED;
    }

    await redis.set(this.getRedisKey(game._id), JSON.stringify(game), { EX: 600 });
    return game;
  }

}
