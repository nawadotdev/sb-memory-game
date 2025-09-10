import { Client, GatewayIntentBits } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN

const discordClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export const getDiscordClient = () => {
    if (!DISCORD_TOKEN) {
        throw new Error("DISCORD_TOKEN is not set");
    }
    if (!discordClient.isReady()) {
        discordClient.login(process.env.DISCORD_TOKEN);
    }
    return discordClient;
}