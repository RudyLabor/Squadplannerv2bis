// OAuth Configuration for all platforms
export const OAUTH_CONFIG = {
  discord: {
    authUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
    clientId: Deno.env.get('DISCORD_CLIENT_ID') || '',
    clientSecret: Deno.env.get('DISCORD_CLIENT_SECRET') || '',
    scopes: ['identify', 'email', 'guilds'],
    redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-e884809f/oauth/discord/callback`,
  },
  
  google: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    calendarUrl: 'https://www.googleapis.com/calendar/v3',
    clientId: Deno.env.get('GOOGLE_CLIENT_ID') || '',
    clientSecret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
    scopes: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/calendar.events',
    ],
    redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-e884809f/oauth/google/callback`,
  },

  twitch: {
    authUrl: 'https://id.twitch.tv/oauth2/authorize',
    tokenUrl: 'https://id.twitch.tv/oauth2/token',
    userInfoUrl: 'https://api.twitch.tv/helix/users',
    clientId: Deno.env.get('TWITCH_CLIENT_ID') || '',
    clientSecret: Deno.env.get('TWITCH_CLIENT_SECRET') || '',
    scopes: ['user:read:email'],
    redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-e884809f/oauth/twitch/callback`,
  },

  steam: {
    authUrl: 'https://steamcommunity.com/openid/login',
    // Steam uses OpenID, not OAuth2
    realm: Deno.env.get('SUPABASE_URL') || '',
    returnTo: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-e884809f/oauth/steam/callback`,
  },

  riot: {
    authUrl: 'https://auth.riotgames.com/authorize',
    tokenUrl: 'https://auth.riotgames.com/token',
    userInfoUrl: 'https://americas.api.riotgames.com/riot/account/v1/accounts/me',
    clientId: Deno.env.get('RIOT_CLIENT_ID') || '',
    clientSecret: Deno.env.get('RIOT_CLIENT_SECRET') || '',
    scopes: ['openid', 'offline_access'],
    redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-e884809f/oauth/riot/callback`,
  },

  battlenet: {
    authUrl: 'https://oauth.battle.net/authorize',
    tokenUrl: 'https://oauth.battle.net/token',
    userInfoUrl: 'https://oauth.battle.net/userinfo',
    clientId: Deno.env.get('BATTLENET_CLIENT_ID') || '',
    clientSecret: Deno.env.get('BATTLENET_CLIENT_SECRET') || '',
    scopes: ['openid'],
    redirectUri: `${Deno.env.get('SUPABASE_URL')}/functions/v1/make-server-e884809f/oauth/battlenet/callback`,
    region: 'eu', // Can be 'us', 'eu', 'kr', 'tw', 'cn'
  },
};

export function getOAuthAuthorizationUrl(platform: string, state: string): string | null {
  const config = OAUTH_CONFIG[platform as keyof typeof OAUTH_CONFIG];
  
  if (!config) return null;

  // Special handling for Steam OpenID
  if (platform === 'steam') {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': config.returnTo,
      'openid.realm': config.realm,
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select',
    });
    return `${config.authUrl}?${params.toString()}`;
  }

  // OAuth2 flow for other platforms
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: config.scopes?.join(' ') || '',
    state: state,
  });

  // Battle.net specific: add region to auth URL
  if (platform === 'battlenet') {
    return `https://${config.region}.battle.net/oauth/authorize?${params.toString()}`;
  }

  return `${config.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  platform: string,
  code: string
): Promise<{ access_token: string; refresh_token?: string; expires_in?: number } | null> {
  const config = OAUTH_CONFIG[platform as keyof typeof OAUTH_CONFIG];
  
  if (!config || platform === 'steam') return null;

  try {
    const body = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
    });

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      console.error(`Token exchange failed for ${platform}:`, await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error exchanging code for token (${platform}):`, error);
    return null;
  }
}

export async function getUserInfo(platform: string, accessToken: string): Promise<any> {
  const config = OAUTH_CONFIG[platform as keyof typeof OAUTH_CONFIG];
  
  if (!config) return null;

  try {
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
    };

    // Twitch requires Client-ID header
    if (platform === 'twitch') {
      headers['Client-Id'] = config.clientId;
    }

    const response = await fetch(config.userInfoUrl, {
      headers,
    });

    if (!response.ok) {
      console.error(`Failed to get user info for ${platform}:`, await response.text());
      return null;
    }

    const data = await response.json();

    // Normalize user data across platforms
    switch (platform) {
      case 'discord':
        return {
          id: data.id,
          username: data.username,
          email: data.email,
          avatar: data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png` : null,
        };
      
      case 'google':
        return {
          id: data.id,
          email: data.email,
          name: data.name,
          avatar: data.picture,
        };
      
      case 'twitch':
        const userData = data.data?.[0];
        return {
          id: userData.id,
          username: userData.login,
          displayName: userData.display_name,
          email: userData.email,
          avatar: userData.profile_image_url,
        };
      
      case 'riot':
        return {
          id: data.puuid,
          gameName: data.gameName,
          tagLine: data.tagLine,
        };
      
      case 'battlenet':
        return {
          id: data.sub,
          battletag: data.battletag,
        };
      
      default:
        return data;
    }
  } catch (error) {
    console.error(`Error getting user info (${platform}):`, error);
    return null;
  }
}
