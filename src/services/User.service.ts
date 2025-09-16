import dbConnect from "@/lib/mongodb";
import { UserDB, IUser } from "@/models/User.model"
import { Types } from "mongoose";

export class UserService {
  static async findOrCreate(discordId: string, discordUsername: string, avatar?: string, userRights: number = 0): Promise<IUser> {
    await dbConnect();
    const user = await UserDB.findOneAndUpdate({ discordId }, { discordUsername, avatar: avatar ?? undefined, userRights }, { new: true, upsert: true });
    return user;
  }

  static async incrementUserRights(userId: Types.ObjectId): Promise<IUser | null> {
    await dbConnect();
    return UserDB.findByIdAndUpdate(
      userId,
      { $inc: { userRights: 1 } },
      { new: true }
    );
  }

  static async setTweetVerified(userId: Types.ObjectId, tweetId: string): Promise<IUser | null> {
    await dbConnect();
    return UserDB.findByIdAndUpdate(
      userId,
      { tweetVerified: tweetId },
      { new: true }
    );
  }

  static async getUser(userId: Types.ObjectId): Promise<IUser | null> {
    await dbConnect();
    return UserDB.findById(userId);
  }

  static async addBurnedNft(userId: Types.ObjectId, nftId: string[]): Promise<IUser | null> {
    await dbConnect();
    return UserDB.findByIdAndUpdate(
      userId,
      { $addToSet: { burnedNfts: { $each: nftId } } },
      { new: true }
    );
  }
}
