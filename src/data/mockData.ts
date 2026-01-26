// Données de démonstration pour la galerie d'écrans
// Toutes les données sont en français et représentatives de l'application

export const mockSquads = [
  {
    id: '1',
    name: 'Les Conquérants',
    game: 'Valorant',
    gameImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
    members: 5,
    maxMembers: 5,
    reliability: 92,
    onlineMembers: 3,
    nextSession: '2024-01-28T20:00:00',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: '2',
    name: 'Team Rocket',
    game: 'League of Legends',
    gameImage: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=200&h=200&fit=crop',
    members: 4,
    maxMembers: 5,
    reliability: 87,
    onlineMembers: 2,
    nextSession: '2024-01-29T19:00:00',
    color: 'from-blue-500 to-purple-500'
  },
  {
    id: '3',
    name: 'Night Raiders',
    game: 'CS2',
    gameImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200&h=200&fit=crop',
    members: 5,
    maxMembers: 5,
    reliability: 95,
    onlineMembers: 0,
    nextSession: '2024-01-27T21:00:00',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: '4',
    name: 'Casual Gamers',
    game: 'Overwatch 2',
    gameImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop',
    members: 3,
    maxMembers: 6,
    reliability: 78,
    onlineMembers: 1,
    nextSession: null,
    color: 'from-teal-500 to-blue-500'
  }
];

export const mockSessions = [
  {
    id: '1',
    title: 'Session ranked - Push Diamant',
    squadId: '1',
    squadName: 'Les Conquérants',
    squad: 'Les Conquérants',
    game: 'Valorant',
    gameImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
    date: '2024-01-28',
    time: '20:00',
    isToday: false,
    slots: [
      { id: 's1', date: '2024-01-28T20:00:00', proposedBy: 'user1' }
    ],
    selectedSlotId: 's1',
    confirmedSlot: {
      id: 's1',
      date: '2024-01-28T20:00:00',
      responses: [
        { userId: 'u1', response: 'yes', player: { id: 'u1', name: 'Thomas "Titan"', avatar: 'T' } },
        { userId: 'u2', response: 'yes', player: { id: 'u2', name: 'Sarah "Phoenix"', avatar: 'S' } },
        { userId: 'u3', response: 'maybe', player: { id: 'u3', name: 'Alex "Kira"', avatar: 'A' } },
        { userId: 'u4', response: 'pending', player: { id: 'u4', name: 'Marie "Luna"', avatar: 'M' } },
      ]
    },
    attendees: [
      { userId: 'u1', name: 'Thomas "Titan"', status: 'yes', avatar: 'T' },
      { userId: 'u2', name: 'Sarah "Phoenix"', status: 'yes', avatar: 'S' },
      { userId: 'u3', name: 'Alex "Kira"', status: 'maybe', avatar: 'A' },
      { userId: 'u4', name: 'Marie "Luna"', status: 'pending', avatar: 'M' },
    ],
    readyCount: 2,
    totalPlayers: 4,
    status: 'pending'
  },
  {
    id: '2',
    title: 'Clash Tournament - Finale',
    squadId: '2',
    squadName: 'Team Rocket',
    squad: 'Team Rocket',
    game: 'League of Legends',
    gameImage: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=200&h=200&fit=crop',
    date: '2024-01-29',
    time: '19:00',
    isToday: false,
    slots: [
      { id: 's2', date: '2024-01-29T19:00:00', proposedBy: 'user2' }
    ],
    selectedSlotId: 's2',
    confirmedSlot: {
      id: 's2',
      date: '2024-01-29T19:00:00',
      responses: [
        { userId: 'u1', response: 'yes', player: { id: 'u1', name: 'Lucas "Storm"', avatar: 'L' } },
        { userId: 'u2', response: 'yes', player: { id: 'u2', name: 'Emma "Luna"', avatar: 'E' } },
        { userId: 'u3', response: 'yes', player: { id: 'u3', name: 'Hugo "Blaze"', avatar: 'H' } },
      ]
    },
    attendees: [
      { userId: 'u1', name: 'Lucas "Storm"', status: 'yes', avatar: 'L' },
      { userId: 'u2', name: 'Emma "Luna"', status: 'yes', avatar: 'E' },
      { userId: 'u3', name: 'Hugo "Blaze"', status: 'yes', avatar: 'H' },
    ],
    readyCount: 3,
    totalPlayers: 3,
    status: 'confirmed'
  },
  {
    id: '3',
    title: 'Chill & Play - Session détente',
    squadId: '1',
    squadName: 'Les Conquérants',
    squad: 'Les Conquérants',
    game: 'Valorant',
    gameImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
    date: '2024-01-25',
    time: '20:00',
    isToday: false,
    slots: [
      { id: 's3', date: '2024-01-25T20:00:00', proposedBy: 'user1' }
    ],
    selectedSlotId: 's3',
    confirmedSlot: {
      id: 's3',
      date: '2024-01-25T20:00:00',
      responses: []
    },
    attendees: [
      { userId: 'u1', name: 'Thomas "Titan"', status: 'yes', avatar: 'T' },
      { userId: 'u2', name: 'Sarah "Phoenix"', status: 'yes', avatar: 'S' },
      { userId: 'u3', name: 'Alex "Kira"', status: 'yes', avatar: 'A' },
      { userId: 'u4', name: 'Marie "Luna"', status: 'yes', avatar: 'M' },
      { userId: 'u5', name: 'Emma "Nova"', status: 'yes', avatar: 'E' },
    ],
    readyCount: 5,
    totalPlayers: 5,
    status: 'completed'
  }
];

export const mockPlayers = [
  {
    rank: 1,
    userId: 'u1',
    name: 'Alexandre "Kira"',
    avatar: 'A',
    reliabilityScore: 98,
    totalSessions: 247,
    isPremium: true,
    isCurrentUser: false
  },
  {
    rank: 2,
    userId: 'u2',
    name: 'Sarah "Phoenix"',
    avatar: 'S',
    reliabilityScore: 96,
    totalSessions: 189,
    isPremium: true,
    isCurrentUser: false
  },
  {
    rank: 3,
    userId: 'u3',
    name: 'Thomas "Titan"',
    avatar: 'T',
    reliabilityScore: 94,
    totalSessions: 203,
    isPremium: false,
    isCurrentUser: false
  },
  {
    rank: 4,
    userId: 'u4',
    name: 'Emma "Luna"',
    avatar: 'E',
    reliabilityScore: 92,
    totalSessions: 156,
    isPremium: false,
    isCurrentUser: true
  },
  {
    rank: 5,
    userId: 'u5',
    name: 'Lucas "Storm"',
    avatar: 'L',
    reliabilityScore: 91,
    totalSessions: 178,
    isPremium: true,
    isCurrentUser: false
  },
  {
    rank: 6,
    userId: 'u6',
    name: 'Marie "Viper"',
    avatar: 'M',
    reliabilityScore: 89,
    totalSessions: 142,
    isPremium: false,
    isCurrentUser: false
  },
  {
    rank: 7,
    userId: 'u7',
    name: 'Hugo "Flash"',
    avatar: 'H',
    reliabilityScore: 87,
    totalSessions: 134,
    isPremium: false,
    isCurrentUser: false
  },
  {
    rank: 8,
    userId: 'u8',
    name: 'Léa "Shadow"',
    avatar: 'L',
    reliabilityScore: 85,
    totalSessions: 119,
    isPremium: true,
    isCurrentUser: false
  }
];

export const mockAchievements = [
  {
    id: '1',
    name: 'Première Session',
    description: 'Participe à ta première session',
    icon: 'trophy',
    unlocked: true,
    unlockedAt: '2024-01-15T18:00:00',
    rarity: 'common',
    points: 10,
    progress: 1,
    total: 1
  },
  {
    id: '2',
    name: 'Fiable à 100%',
    description: 'Maintiens une fiabilité de 100% pendant 30 jours',
    icon: 'star',
    unlocked: true,
    unlockedAt: '2024-01-20T12:00:00',
    rarity: 'epic',
    points: 50,
    progress: 30,
    total: 30
  },
  {
    id: '3',
    name: 'Marathonien',
    description: 'Joue 100 sessions',
    icon: 'flame',
    unlocked: true,
    unlockedAt: '2024-01-22T20:00:00',
    rarity: 'rare',
    points: 30,
    progress: 100,
    total: 100
  },
  {
    id: '4',
    name: 'Chef d\'Équipe',
    description: 'Crée 5 squads',
    icon: 'users',
    unlocked: false,
    unlockedAt: null,
    rarity: 'rare',
    points: 25,
    progress: 2,
    total: 5
  },
  {
    id: '5',
    name: 'Légende Vivante',
    description: 'Atteins le rang Diamant',
    icon: 'crown',
    unlocked: false,
    unlockedAt: null,
    rarity: 'legendary',
    points: 100,
    progress: 3,
    total: 5
  },
  {
    id: '6',
    name: 'Social Butterfly',
    description: 'Ajoute 50 amis',
    icon: 'heart',
    unlocked: false,
    unlockedAt: null,
    rarity: 'rare',
    points: 20,
    progress: 18,
    total: 50
  }
];

export const mockBadges = [
  {
    id: 'reliable',
    name: 'Fiable',
    description: 'Fiabilité > 90%',
    rarity: 'epic',
    unlocked: true,
    equipped: true,
    unlockedAt: '2024-01-18T10:00:00'
  },
  {
    id: 'consistent',
    name: 'Régulier',
    description: '30 sessions ce mois-ci',
    rarity: 'rare',
    unlocked: true,
    equipped: true,
    unlockedAt: '2024-01-22T15:00:00'
  },
  {
    id: 'perfect',
    name: 'Parfait',
    description: '100% de présence sur 20 sessions',
    rarity: 'legendary',
    unlocked: true,
    equipped: true,
    unlockedAt: '2024-01-24T12:00:00'
  },
  {
    id: 'active',
    name: 'Actif',
    description: 'Connecté tous les jours',
    rarity: 'common',
    unlocked: true,
    equipped: false,
    unlockedAt: '2024-01-16T08:00:00'
  },
  {
    id: 'leader',
    name: 'Leader',
    description: 'Gère 3 squads actives',
    rarity: 'epic',
    unlocked: false,
    equipped: false,
    unlockedAt: null
  }
];

export const mockFriends = [
  {
    id: 'u1',
    name: 'Alexandre "Kira"',
    avatar: 'A',
    status: 'online',
    reliabilityScore: 98,
    mutualSquads: 3,
    lastSeen: 'En ligne'
  },
  {
    id: 'u2',
    name: 'Sarah "Phoenix"',
    avatar: 'S',
    status: 'in-game',
    reliabilityScore: 96,
    mutualSquads: 2,
    lastSeen: 'En jeu - Valorant'
  },
  {
    id: 'u3',
    name: 'Thomas "Titan"',
    avatar: 'T',
    status: 'online',
    reliabilityScore: 94,
    mutualSquads: 2,
    lastSeen: 'En ligne'
  },
  {
    id: 'u5',
    name: 'Lucas "Storm"',
    avatar: 'L',
    status: 'offline',
    reliabilityScore: 91,
    mutualSquads: 1,
    lastSeen: 'Il y a 2h'
  },
  {
    id: 'u6',
    name: 'Marie "Viper"',
    avatar: 'M',
    status: 'offline',
    reliabilityScore: 89,
    mutualSquads: 1,
    lastSeen: 'Il y a 5h'
  }
];

export const mockChallenges = [
  {
    id: '1',
    name: 'Semaine Parfaite',
    description: 'Participe à toutes les sessions cette semaine',
    progress: 4,
    total: 7,
    reward: '+50 points',
    deadline: '2024-01-28T23:59:59',
    difficulty: 'medium',
    icon: 'calendar'
  },
  {
    id: '2',
    name: 'Marathonien',
    description: 'Joue 10 sessions ce mois-ci',
    progress: 7,
    total: 10,
    reward: 'Badge Marathonien',
    deadline: '2024-01-31T23:59:59',
    difficulty: 'easy',
    icon: 'flame'
  },
  {
    id: '3',
    name: 'Organisateur',
    description: 'Propose 5 sessions qui sont acceptées',
    progress: 2,
    total: 5,
    reward: '+100 points',
    deadline: '2024-02-15T23:59:59',
    difficulty: 'hard',
    icon: 'crown'
  }
];

export const mockActivities = [
  {
    id: '1',
    type: 'session_completed',
    user: { name: 'Alexandre "Kira"', avatar: 'A' },
    message: 'a terminé une session',
    game: 'Valorant',
    squad: 'Les Conquérants',
    timestamp: '2024-01-26T20:30:00',
    likes: 12
  },
  {
    id: '2',
    type: 'achievement_unlocked',
    user: { name: 'Sarah "Phoenix"', avatar: 'S' },
    message: 'a débloqué',
    achievement: 'Fiable à 100%',
    timestamp: '2024-01-26T18:15:00',
    likes: 8
  },
  {
    id: '3',
    type: 'squad_created',
    user: { name: 'Thomas "Titan"', avatar: 'T' },
    message: 'a créé la squad',
    squad: 'Night Raiders',
    game: 'CS2',
    timestamp: '2024-01-26T15:00:00',
    likes: 15
  },
  {
    id: '4',
    type: 'level_up',
    user: { name: 'Emma "Luna"', avatar: 'E' },
    message: 'est passé niveau',
    level: 25,
    timestamp: '2024-01-26T12:00:00',
    likes: 6
  }
];

export const mockStats = {
  totalSessions: 247,
  completedSessions: 234,
  reliabilityScore: 94.7,
  totalHoursPlayed: 1847,
  favoriteGame: 'Valorant',
  averageSessionDuration: 7.5,
  longestStreak: 42,
  currentStreak: 12,
  squadsJoined: 8,
  squadsCreated: 3,
  achievementsUnlocked: 47,
  totalPoints: 12450
};

export const mockUser = {
  id: 'current-user',
  name: 'Emma "Luna"',
  email: 'emma.luna@squad.gg',
  avatar: 'E',
  bio: 'Gameuse passionnée 🎮 | Team player ✨ | Toujours à l\'heure 🎯',
  reliabilityScore: 92,
  level: 24,
  joinedDate: '2023-09-15T10:00:00',
  favoriteGames: ['Valorant', 'Overwatch 2', 'Apex Legends'],
  badges: ['reliable', 'consistent', 'perfect'],
  isPremium: false,
  stats: mockStats
};

// Mock pour les tournois
export const mockTournaments = [
  {
    id: '1',
    name: 'Coupe d\'Hiver 2024',
    game: 'Valorant',
    startDate: '2024-02-10T14:00:00',
    endDate: '2024-02-11T20:00:00',
    teams: 16,
    prizePool: '500€',
    status: 'upcoming',
    participants: 64
  },
  {
    id: '2',
    name: 'League Championship',
    game: 'League of Legends',
    startDate: '2024-02-15T18:00:00',
    endDate: '2024-02-16T22:00:00',
    teams: 8,
    prizePool: '300€',
    status: 'registration',
    participants: 32
  }
];

// Mock pour la communauté
export const mockCommunityPosts = [
  {
    id: '1',
    author: { name: 'Alexandre "Kira"', avatar: 'A' },
    content: 'Qui est chaud pour un tournoi Valorant ce weekend ? 🔥',
    timestamp: '2024-01-26T15:30:00',
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: '2',
    author: { name: 'Sarah "Phoenix"', avatar: 'S' },
    content: 'GG à toute la team pour la session d\'hier ! On était au top 🎯',
    timestamp: '2024-01-26T09:15:00',
    likes: 18,
    comments: 5,
    isLiked: true
  }
];

// Mock pour les messages de chat
export const mockMessages = [
  {
    id: 'm1',
    userId: 'u1',
    userName: 'Alexandre "Kira"',
    userAvatar: 'A',
    content: 'Salut la team ! On est chauds pour ce soir ?',
    timestamp: '2024-01-27T18:30:00',
    isCurrentUser: false
  },
  {
    id: 'm2',
    userId: 'u2',
    userName: 'Sarah "Phoenix"',
    userAvatar: 'S',
    content: 'Grave ! Je suis dispo à partir de 20h',
    timestamp: '2024-01-27T18:32:00',
    isCurrentUser: false
  },
  {
    id: 'm3',
    userId: 'current-user',
    userName: 'Emma "Luna"',
    userAvatar: 'E',
    content: 'Pareil pour moi, 20h ça roule 👍',
    timestamp: '2024-01-27T18:33:00',
    isCurrentUser: true
  },
  {
    id: 'm4',
    userId: 'u3',
    userName: 'Thomas "Titan"',
    userAvatar: 'T',
    content: 'Ok nickel, on se retrouve sur Discord ?',
    timestamp: '2024-01-27T18:35:00',
    isCurrentUser: false
  },
  {
    id: 'm5',
    userId: 'u1',
    userName: 'Alexandre "Kira"',
    userAvatar: 'A',
    content: 'Ouais, je crée le salon vocal 🎮',
    timestamp: '2024-01-27T18:36:00',
    isCurrentUser: false
  }
];

// Mock pour les squads découvertes
export const mockDiscoverSquads = [
  {
    id: 'ds1',
    name: 'Pro Gamers Elite',
    game: 'Valorant',
    gameImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&h=200&fit=crop',
    members: 5,
    maxMembers: 5,
    avgReliability: 95,
    isPublic: true,
    language: 'Français',
    region: 'EU West'
  },
  {
    id: 'ds2',
    name: 'Chill & Play',
    game: 'Overwatch 2',
    gameImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&h=200&fit=crop',
    members: 3,
    maxMembers: 6,
    avgReliability: 82,
    isPublic: true,
    language: 'Français',
    region: 'EU West'
  }
];