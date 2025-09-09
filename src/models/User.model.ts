import { model, models, Schema, Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    discordId: string;
    discordUsername: string;
    usedRights: number;
    tweetVerified?: string
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    discordId: { type: String, required: true, unique: true },
    discordUsername: { type: String, required: true },
    usedRights: { type: Number, required: true },
    tweetVerified: { type: String, unique: true },
}, {
    timestamps: true,
});

userSchema.index({ discordId: 1 }, { unique: true });

export const UserDB = models?.User || model<IUser>('User', userSchema);