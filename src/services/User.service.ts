import dbConnect from "@/lib/mongodb";
import { UserDB, IUser } from "@/models/User.model"
import { Types } from "mongoose";

export class UserService {
  static async findOrCreate(discordId: string, discordUsername: string, avatar?: string): Promise<IUser> {
    await dbConnect();
    const user = await UserDB.findOneAndUpdate({ discordId }, { discordUsername, avatar: avatar ?? undefined }, { new: true, upsert: true });
    return user;
  }

  static async incrementUsedRights(userId: Types.ObjectId): Promise<IUser | null> {
    await dbConnect();
    return UserDB.findByIdAndUpdate(
      userId,
      { $inc: { usedRights: 1 } },
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
}
