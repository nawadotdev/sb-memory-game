import { Schema, Types, model, models } from "mongoose";

export enum GameActionType {
    START = 'start',
    END = "end",
    FLIP = "flip",
    MATCH = "match",
}

export enum GameStatus {
    STARTED = 'started',
    ENDED = "ended",
    PAUSED = "paused",
    RESUMED = "resumed",
}

export interface GameAction {
    action: GameActionType;
    timestamp: number;
    cardIndex?: number;
    matchedCardIndex?: number[];
}

export interface IGame {
    _id: Types.ObjectId;
    actions: GameAction[];
    status: GameStatus;
    deck: string[];
    score: number;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const gameActionSchema = new Schema<GameAction>({
    action: { type: String, enum: Object.values(GameActionType), required: true },
    timestamp: { type: Number, required: true },
    cardIndex: { type: Number, required: false },
    matchedCardIndex: { type: [Number], required: false },
}, { id: false, _id: false });

const gameSchema = new Schema<IGame>({
    actions: { type: [gameActionSchema], required: true, default: [] },
    status: { type: String, enum: Object.values(GameStatus), required: true },
    deck: { type: [String], required: true },
    score: { type: Number, required: true, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const GameDB = models?.Game || model<IGame>('Game', gameSchema);

