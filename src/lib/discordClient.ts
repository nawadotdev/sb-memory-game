import { Client, GatewayIntentBits, GuildMember } from "discord.js";

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = "1183302319987752971"

const discordClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

export const getDiscordClient = () => {
    if (!DISCORD_TOKEN) {
        throw new Error("DISCORD_TOKEN is not set");
    }
    if (!discordClient.isReady()) {
        discordClient.login(DISCORD_TOKEN);
    }
    return discordClient;
}

export const getUserRoles = async (userId: string) => {
    const client = getDiscordClient()
    const guild = await client.guilds.fetch(GUILD_ID)

    let member: GuildMember
    try{
        member = await guild.members.fetch(userId)
    } catch (error) {
        console.error(error)
        return []
    }   

    return member.roles.cache.map(role => role.id)
}