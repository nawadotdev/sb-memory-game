const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = "1183302319987752971"

export async function getUserRoles(userId: string): Promise<string[]> {

    if (!DISCORD_TOKEN || !GUILD_ID) {
        throw new Error("Missing DISCORD_BOT_TOKEN or GUILD_ID");
    }
    
    const res = await fetch(
        `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${userId}`,
        {
            headers: {
                Authorization: `Bot ${DISCORD_TOKEN}`,
            },
        }
    );

    if (!res.ok) {
        console.error("Discord API error", await res.text());
        return [];
    }

    const member = await res.json();
    console.log(member)
    return member.roles as string[];
}
