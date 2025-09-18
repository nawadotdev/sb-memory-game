import { model, models, Schema, Types } from "mongoose";

const GameRightForPerNft = 5
const GameRightForTweet = 1

export interface IUser {
    _id: Types.ObjectId;
    discordId: string;
    discordUsername: string;
    userRights: number;
    tweetVerified?: string
    avatar?: string
    burnedNfts: string[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    discordId: { type: String, required: true, unique: true },
    discordUsername: { type: String, required: true },
    userRights: { type: Number, required: true, default: 0 },
    tweetVerified: { type: String, unique: true, required: false, sparse: true },
    burnedNfts: { type: [String], required: true, default: [] },
    avatar: { type: String, required: false },
}, {
    timestamps: true,
});

export const UserDB = models?.User || model<IUser>('User', userSchema);

const RolesAndRights = {
    "1411285032865107968" : 10 * 2, // playboy
    "1411284997968760832" : 6 * 2, // gigachad
    "1411284952389259404" : 5 * 2, // chad
    "1411284920755552358" : 4 * 2, // womanizer
    "1411284876308647936" : 3 * 2, // stoud
    "1411284842506620970" : 2 * 2, // divas
    "1411284793932386305":  1 * 2, // alphas
}

export const getRights = (roles: string[]) => {
    let maxRight = 0
    for (const role of roles) {
        if (RolesAndRights[role as keyof typeof RolesAndRights]) {
            maxRight = Math.max(maxRight, RolesAndRights[role as keyof typeof RolesAndRights])
        }
    }
    return maxRight
}

export const getGameRights = (user: IUser) => {
    const tweetRights = user.tweetVerified ? GameRightForTweet : 0
    const nftRights = user.burnedNfts.length * GameRightForPerNft
    return tweetRights + nftRights + user.userRights
}