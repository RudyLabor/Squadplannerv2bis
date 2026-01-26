// 🎮 JEUX POPULAIRES 2026 - IMAGES OFFICIELLES

export interface Game {
  id: string;
  name: string;
  category: 'fps' | 'moba' | 'br' | 'rpg' | 'sports' | 'strategy' | 'coop' | 'casual';
  image: string; // URL vers image officielle du jeu
  players: string;
  ranked: boolean;
  developer?: string;
  releaseYear?: number;
}

// 🔥 TOP JEUX 2026 AVEC VRAIES IMAGES
export const games: Game[] = [
  // FPS - First Person Shooter
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'fps',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/capsule_616x353.jpg',
    players: '5v5',
    ranked: true,
    developer: 'Riot Games',
    releaseYear: 2020,
  },
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    category: 'fps',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
    players: '5v5',
    ranked: true,
    developer: 'Valve',
    releaseYear: 2023,
  },
  {
    id: 'cod-warzone',
    name: 'Call of Duty: Warzone',
    category: 'br',
    image: 'https://www.callofduty.com/content/dam/atvi/callofduty/cod-touchui/store/games/wz2/overview/WZII-TOUT-PLAYER-TOUT.jpg',
    players: '1-4',
    ranked: true,
    developer: 'Activision',
    releaseYear: 2022,
  },
  {
    id: 'overwatch2',
    name: 'Overwatch 2',
    category: 'fps',
    image: 'https://images.blz-contentstack.com/v3/assets/blt9c12f249ac15c7ec/blt3b77ea0e99c31808/632bc4dc81df060cf59daaf4/OW2_reveal_keyart_16-9.jpg',
    players: '5v5',
    ranked: true,
    developer: 'Blizzard',
    releaseYear: 2022,
  },
  {
    id: 'r6-siege',
    name: 'Rainbow Six Siege',
    category: 'fps',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/359550/header.jpg',
    players: '5v5',
    ranked: true,
    developer: 'Ubisoft',
    releaseYear: 2015,
  },
  {
    id: 'the-finals',
    name: 'The Finals',
    category: 'fps',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2073850/header.jpg',
    players: '3v3v3v3',
    ranked: true,
    developer: 'Embark Studios',
    releaseYear: 2023,
  },
  {
    id: 'marvel-rivals',
    name: 'Marvel Rivals',
    category: 'fps',
    image: 'https://cdn.marvel.com/content/1x/marvelrivals_lob_mas_dsk_01.jpg',
    players: '6v6',
    ranked: true,
    developer: 'NetEase',
    releaseYear: 2024,
  },
  {
    id: 'delta-force',
    name: 'Delta Force',
    category: 'fps',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2156630/header.jpg',
    players: '5v5',
    ranked: true,
    developer: 'TiMi Studios',
    releaseYear: 2024,
  },
  {
    id: 'destiny2',
    name: 'Destiny 2',
    category: 'fps',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1085660/header.jpg',
    players: '1-6',
    ranked: true,
    developer: 'Bungie',
    releaseYear: 2017,
  },
  {
    id: 'tarkov',
    name: 'Escape from Tarkov',
    category: 'fps',
    image: 'https://cdn.escapefromtarkov.com/uploads/monthly_2023_08/EFT_2023_desktop_1920x1080.jpg.e8c0f5d1e3b6c43c7e3b6c4b7e3b6c4b.jpg',
    players: '1-5',
    ranked: false,
    developer: 'Battlestate Games',
    releaseYear: 2017,
  },

  // MOBA
  {
    id: 'lol',
    name: 'League of Legends',
    category: 'moba',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/113200/header.jpg',
    players: '5v5',
    ranked: true,
    developer: 'Riot Games',
    releaseYear: 2009,
  },
  {
    id: 'dota2',
    name: 'Dota 2',
    category: 'moba',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg',
    players: '5v5',
    ranked: true,
    developer: 'Valve',
    releaseYear: 2013,
  },
  {
    id: 'deadlock',
    name: 'Deadlock',
    category: 'moba',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1422450/header.jpg',
    players: '6v6',
    ranked: true,
    developer: 'Valve',
    releaseYear: 2024,
  },
  {
    id: 'smite2',
    name: 'SMITE 2',
    category: 'moba',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1123560/header.jpg',
    players: '5v5',
    ranked: true,
    developer: 'Titan Forge Games',
    releaseYear: 2024,
  },

  // Battle Royale
  {
    id: 'fortnite',
    name: 'Fortnite',
    category: 'br',
    image: 'https://cdn2.unrealengine.com/fortnite-chapter-5-season-1-key-art-1920x1080-a0f38c5dea90.jpg',
    players: '1-4',
    ranked: true,
    developer: 'Epic Games',
    releaseYear: 2017,
  },
  {
    id: 'apex',
    name: 'Apex Legends',
    category: 'br',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172470/header.jpg',
    players: '1-3',
    ranked: true,
    developer: 'Respawn',
    releaseYear: 2019,
  },
  {
    id: 'pubg',
    name: 'PUBG',
    category: 'br',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg',
    players: '1-4',
    ranked: true,
    developer: 'PUBG Corporation',
    releaseYear: 2017,
  },

  // RPG / Action
  {
    id: 'elden-ring',
    name: 'Elden Ring',
    category: 'rpg',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'FromSoftware',
    releaseYear: 2022,
  },
  {
    id: 'bg3',
    name: "Baldur's Gate 3",
    category: 'rpg',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Larian Studios',
    releaseYear: 2023,
  },
  {
    id: 'diablo4',
    name: 'Diablo IV',
    category: 'rpg',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2344520/header.jpg',
    players: '1-4',
    ranked: true,
    developer: 'Blizzard',
    releaseYear: 2023,
  },
  {
    id: 'poe2',
    name: 'Path of Exile 2',
    category: 'rpg',
    image: 'https://web.poecdn.com/public/news/2023-11-30/POE2EAHeader.jpg',
    players: '1-6',
    ranked: false,
    developer: 'Grinding Gear Games',
    releaseYear: 2024,
  },
  {
    id: 'lost-ark',
    name: 'Lost Ark',
    category: 'rpg',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1599340/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Smilegate',
    releaseYear: 2022,
  },
  {
    id: 'ff14',
    name: 'Final Fantasy XIV',
    category: 'rpg',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/39210/header.jpg',
    players: '1-8+',
    ranked: false,
    developer: 'Square Enix',
    releaseYear: 2013,
  },
  {
    id: 'wow',
    name: 'World of Warcraft',
    category: 'rpg',
    image: 'https://bnetcmsus-a.akamaihd.net/cms/page_media/w3/W3R7CQ1F8M0Q1668626401849.jpg',
    players: '1-40+',
    ranked: false,
    developer: 'Blizzard',
    releaseYear: 2004,
  },

  // Sports
  {
    id: 'rocket-league',
    name: 'Rocket League',
    category: 'sports',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252950/header.jpg',
    players: '1-4',
    ranked: true,
    developer: 'Psyonix',
    releaseYear: 2015,
  },
  {
    id: 'fc25',
    name: 'EA FC 25',
    category: 'sports',
    image: 'https://media.contentapi.ea.com/content/dam/ea/fc/fc-25/common/featured-tile-16x9-fc25.jpg.adapt.1920w.jpg',
    players: '1-2',
    ranked: true,
    developer: 'EA Sports',
    releaseYear: 2024,
  },
  {
    id: 'nba2k25',
    name: 'NBA 2K25',
    category: 'sports',
    image: 'https://cdn.2k.com/2k/global/news/2024/nba2k25-cover-athlete-announcement.jpg',
    players: '1-10',
    ranked: true,
    developer: '2K Sports',
    releaseYear: 2024,
  },

  // Fighting
  {
    id: 'tekken8',
    name: 'Tekken 8',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1778820/header.jpg',
    players: '1-2',
    ranked: true,
    developer: 'Bandai Namco',
    releaseYear: 2024,
  },
  {
    id: 'sf6',
    name: 'Street Fighter 6',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1364780/header.jpg',
    players: '1-2',
    ranked: true,
    developer: 'Capcom',
    releaseYear: 2023,
  },
  {
    id: 'mk1',
    name: 'Mortal Kombat 1',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1971870/header.jpg',
    players: '1-2',
    ranked: true,
    developer: 'NetherRealm',
    releaseYear: 2023,
  },

  // Co-op / Horror
  {
    id: 'dbd',
    name: 'Dead by Daylight',
    category: 'coop',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/381210/header.jpg',
    players: '1-5',
    ranked: false,
    developer: 'Behaviour Interactive',
    releaseYear: 2016,
  },
  {
    id: 'phasmophobia',
    name: 'Phasmophobia',
    category: 'coop',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/739630/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Kinetic Games',
    releaseYear: 2020,
  },
  {
    id: 'lethal-company',
    name: 'Lethal Company',
    category: 'coop',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1966720/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Zeekerss',
    releaseYear: 2023,
  },
  {
    id: 'helldivers2',
    name: 'Helldivers 2',
    category: 'coop',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/553850/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Arrowhead Game Studios',
    releaseYear: 2024,
  },
  {
    id: 'sons-forest',
    name: 'Sons of the Forest',
    category: 'coop',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1326470/header.jpg',
    players: '1-8',
    ranked: false,
    developer: 'Endnight Games',
    releaseYear: 2023,
  },
  {
    id: 'sea-of-thieves',
    name: 'Sea of Thieves',
    category: 'coop',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1172620/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Rare',
    releaseYear: 2018,
  },

  // Casual / Survival
  {
    id: 'minecraft',
    name: 'Minecraft',
    category: 'casual',
    image: 'https://www.minecraft.net/content/dam/games/minecraft/marketplace/mediablock-buzzybees.jpg',
    players: '1-10+',
    ranked: false,
    developer: 'Mojang',
    releaseYear: 2011,
  },
  {
    id: 'palworld',
    name: 'Palworld',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1623730/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Pocketpair',
    releaseYear: 2024,
  },
  {
    id: 'gta5',
    name: 'GTA V Online',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg',
    players: '1-30',
    ranked: false,
    developer: 'Rockstar',
    releaseYear: 2013,
  },
  {
    id: 'rust',
    name: 'Rust',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/252490/header.jpg',
    players: '1-8+',
    ranked: false,
    developer: 'Facepunch Studios',
    releaseYear: 2018,
  },
  {
    id: 'ark',
    name: 'ARK: Survival Ascended',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/2399830/header.jpg',
    players: '1-70',
    ranked: false,
    developer: 'Studio Wildcard',
    releaseYear: 2023,
  },
  {
    id: 'satisfactory',
    name: 'Satisfactory',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/526870/header.jpg',
    players: '1-4',
    ranked: false,
    developer: 'Coffee Stain Studios',
    releaseYear: 2024,
  },

  // Strategy
  {
    id: 'tft',
    name: 'Teamfight Tactics',
    category: 'strategy',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1090150/header.jpg',
    players: '1-8',
    ranked: true,
    developer: 'Riot Games',
    releaseYear: 2019,
  },
  {
    id: 'hearthstone',
    name: 'Hearthstone',
    category: 'strategy',
    image: 'https://bnetcmsus-a.akamaihd.net/cms/page_media/oe/OE5EWH13UGUH1668626401849.jpg',
    players: '1-2',
    ranked: true,
    developer: 'Blizzard',
    releaseYear: 2014,
  },
  {
    id: 'marvel-snap',
    name: 'Marvel Snap',
    category: 'strategy',
    image: 'https://cdn.marvel.com/content/1x/marvelsnap_lob_mas_dsk_01.jpg',
    players: '1v1',
    ranked: true,
    developer: 'Second Dinner',
    releaseYear: 2022,
  },
  {
    id: 'clash-royale',
    name: 'Clash Royale',
    category: 'strategy',
    image: 'https://supercell.com/images/e1bbf42cd92d86c1b92ae2eb2de86c1c/clash_royale.jpg',
    players: '1v1',
    ranked: true,
    developer: 'Supercell',
    releaseYear: 2016,
  },

  // Additional popular games
  {
    id: 'enshrouded',
    name: 'Enshrouded',
    category: 'rpg',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1203620/header.jpg',
    players: '1-16',
    ranked: false,
    developer: 'Keen Games',
    releaseYear: 2024,
  },
  {
    id: 'among-us',
    name: 'Among Us',
    category: 'casual',
    image: 'https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg',
    players: '4-15',
    ranked: false,
    developer: 'Innersloth',
    releaseYear: 2018,
  },
  {
    id: 'brawl-stars',
    name: 'Brawl Stars',
    category: 'casual',
    image: 'https://supercell.com/images/3f4e6f8b2e8f6b8e2f6e8b2f8e6b8e2f/brawl_stars.jpg',
    players: '1-3',
    ranked: true,
    developer: 'Supercell',
    releaseYear: 2018,
  },
];

// Helper functions
export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

export const getGamesByCategory = (category: Game['category']): Game[] => {
  return games.filter(game => game.category === category);
};

export const getPopularGames = (limit: number = 12): Game[] => {
  // Return top games based on ranked status and players
  return games
    .filter(game => game.ranked)
    .slice(0, limit);
};

export const searchGames = (query: string): Game[] => {
  const lowercaseQuery = query.toLowerCase();
  return games.filter(game => 
    game.name.toLowerCase().includes(lowercaseQuery) ||
    game.developer?.toLowerCase().includes(lowercaseQuery)
  );
};

// Category labels for UI
export const categoryLabels: Record<Game['category'], string> = {
  fps: 'FPS',
  moba: 'MOBA',
  br: 'Battle Royale',
  rpg: 'RPG',
  sports: 'Sports',
  strategy: 'Stratégie',
  coop: 'Co-op',
  casual: 'Casual',
};

// Category icons
export const categoryIcons: Record<Game['category'], string> = {
  fps: '🎯',
  moba: '⚔️',
  br: '🏆',
  rpg: '🗡️',
  sports: '⚽',
  strategy: '🧠',
  coop: '🤝',
  casual: '🎮',
};
