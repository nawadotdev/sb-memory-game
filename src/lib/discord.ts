const CLIENT_ID = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const REDIRECT_URI = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI

export async function getOAuthUrl({ scopes }: { scopes: string[] }) {

    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        throw new Error("CLIENT_ID, CLIENT_SECRET or REDIRECT_URI is not set");
    }

    const state = crypto.randomUUID();

    const url = new URL('https://discord.com/api/oauth2/authorize');
    url.searchParams.set('client_id', CLIENT_ID!);
    url.searchParams.set('redirect_uri', REDIRECT_URI!);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('state', state);
    url.searchParams.set('scope', scopes.join(" "));
    url.searchParams.set('prompt', 'consent');
    return { state, url: url.toString() };

}

interface OAuthTokenResponse {
    token_type: string // Bearer
    access_token: string
    expires_in: number
    refresh_token: string
    scope: string
}

export async function getOAuthToken(code: string): Promise<OAuthTokenResponse> {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        throw new Error("CLIENT_ID, CLIENT_SECRET or REDIRECT_URI is not set");
    }

    const url = 'https://discord.com/api/v10/oauth2/token';
    const body = new URLSearchParams({
        client_id: CLIENT_ID!,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
    })

    const response = await fetch(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to get OAuth token')
    }

    const data = await response.json()
    return data
}

interface DiscordUser {
    id: string
    username: string
    avatar: string | null
    discriminator: string
    public_flags: number
    flags: number
    banner: string | null
    accent_color: number | null
    global_name: string | null
}

interface DiscordOAuthMe {
    application: {
        id: string
        name: string
        icon: string | null
        description: string
        type: number | null
        bot: {
            id: string
            username: string
            avatar: string | null
            discriminator: string
            public_flags: number
            flags: number
            bot: boolean
            banner: string | null
            accent_color: number | null
            global_name: string | null
        }
        summary: string
        is_monetized: boolean
        is_verified: boolean
        is_discoverable: boolean
        bot_public: boolean
        bot_require_code_grant: boolean
        install_params: {
            scopes: string[]
            permissions: string
        }
        verify_key: string
        flags: number
        hook: boolean
        storefront_available: boolean
    }
    expires: string
    scopes: string[]
    user: DiscordUser
}

export async function getUserData(accessToken: string): Promise<DiscordOAuthMe> {
    if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
        throw new Error("CLIENT_ID, CLIENT_SECRET or REDIRECT_URI is not set");
    }

    const url = 'https://discord.com/api/v10/oauth2/@me';
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
    }
}