// 🌍 SQUAD PLANNER - PREMIUM COPYWRITING v2.0
// Voice: Apple + Spotify + Linear + Notion
// Tone: Warm, precise, human, gaming-native
// Rules: Max 12 words, action-oriented, never corporate

export type Language = 'fr' | 'en';

export const translations = {
  fr: {
    // Navigation
    nav: {
      home: 'Accueil',
      sessions: 'Sessions',
      squads: 'Squads',
      profile: 'Profil',
    },

    // Home Screen - REWRITTEN
    home: {
      hero: {
        badge: '',
        title: 'Squad Planner',
        subtitle: 'Fini le \"on verra\". Place aux sessions qui comptent.',
        stats: {
          sessions: 'Sessions',
          players: 'Joueurs',
          reliability: 'Fiabilité',
        },
      },
      nextSession: {
        title: 'Prochaine session',
        today: "Aujourd'hui",
        tomorrow: 'Demain',
        saturday: 'Samedi',
        sunday: 'Dimanche',
        starting: 'Ça démarre bientôt',
        join: 'Rejoindre',
        joinNow: 'Go',
        confirmed: 'prêts',
      },
      mySquads: {
        title: 'Mes squads',
        viewAll: 'Tout voir',
        seeAll: 'Tout voir',
        responseNeeded: 'Dis si tu viens',
        online: 'en ligne',
        createNew: 'Créer une squad',
        createDescription: 'Monte ton équipe',
      },
      quickActions: {
        title: 'Actions rapides',
        createSquad: 'Créer une squad',
        createSquadDesc: 'Monte ton équipe',
        proposeSession: 'Proposer un créneau',
        proposeSessionDesc: 'Trouve un moment qui marche',
        proposeDescription: 'Trouve un moment qui marche',
        browseSquads: 'Explorer les squads',
        browseDescription: 'Rejoins de nouvelles équipes',
        viewHistory: 'Historique',
        historyDescription: 'Tes stats et performances',
      },
      emptyState: {
        title: 'Crée ta première squad',
        description: 'Rassemble tes mates et organisez vos sessions',
        action: 'Créer ma squad',
      },
      title: 'Squad Planner',
      subtitle: 'Organisez vos sessions gaming',
      activeSquads: 'Squads actives',
      upcomingSessions: 'Prochaines sessions',
      stats: {
        totalSessions: 'Sessions',
        hoursPlayed: 'Heures de jeu',
        winRate: 'Victoires',
        reliability: 'Fiabilité',
      },
      liveNow: 'EN DIRECT',
      createSquad: 'Créer une squad',
      viewAll: 'Tout voir',
      noSessions: 'Aucune session prévue',
      noSquads: 'Aucune squad active',
    },

    // Sessions Screen - REWRITTEN
    sessions: {
      title: 'Mes sessions',
      subtitle: 'Tes prochaines parties et ton historique',
      upcoming: 'À venir',
      past: 'Passées',
      create: 'Nouvelle session',
      filters: {
        all: 'Toutes',
        today: "Aujourd'hui",
        upcoming: 'À venir',
        week: 'Cette semaine',
        month: 'Ce mois',
      },
      details: {
        game: 'Jeu',
        date: 'Date',
        time: 'Heure',
        duration: 'Durée',
        players: 'Joueurs',
        status: 'Statut',
      },
      status: {
        confirmed: 'Confirmée',
        pending: 'En attente',
        cancelled: 'Annulée',
        completed: 'Terminée',
      },
      actions: {
        join: 'Rejoindre',
        leave: 'Quitter',
        cancel: 'Annuler',
        edit: 'Modifier',
      },
      stats: {
        title: 'Tes stats',
        confirmed: 'Confirmées',
        pending: 'En attente',
        avgReliability: 'Fiabilité moyenne',
      },
    },

    // Squads Screen - REWRITTEN
    squads: {
      title: 'Mes squads',
      mySquads: 'Mes squads',
      discover: 'Explorer',
      create: 'Créer une squad',
      members: 'membres',
      activeSessions: 'sessions actives',
      join: 'Rejoindre',
      leave: 'Quitter',
      manage: 'Gérer',
      active: 'Active',
      noResults: 'Aucune squad ne correspond',
      stats: {
        members: 'Membres',
        sessions: 'Sessions',
        winRate: 'Victoires',
        founded: 'Créée le',
      },
      roles: {
        leader: 'Leader',
        admin: 'Admin',
        member: 'Membre',
      },
    },

    // Profile Screen - REWRITTEN
    profile: {
      title: 'Profil',
      stats: 'Stats',
      settings: 'Réglages',
      recentGames: 'Jeux récents',
      favoriteGames: 'Jeux favoris',
      level: 'Niveau',
      badges: {
        founder: 'Fondateur',
        veteran: 'Vétéran',
        reliable: 'Fiable',
        champion: 'Champion',
        social: 'Social',
      },
      editProfile: 'Modifier',
      signOut: 'Déconnexion',
      statsTitle: 'Tes stats',
      achievementsTitle: 'Succès',
      recentActivity: 'Activité récente',
    },

    // Game Selection - REWRITTEN
    games: {
      title: 'Choisis ton jeu',
      search: 'Rechercher...',
      popular: 'Populaires',
      recent: 'Récents',
      all: 'Tous les jeux',
      categories: {
        fps: 'FPS',
        moba: 'MOBA',
        br: 'Battle Royale',
        rpg: 'RPG',
        sports: 'Sports',
        strategy: 'Stratégie',
        coop: 'Coop',
        casual: 'Casual',
      },
    },

    // Common - REWRITTEN (verbes d'action forts)
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      confirm: 'Confirmer',
      back: 'Retour',
      next: 'Continuer',
      finish: 'Terminer',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Parfait',
      online: 'En ligne',
      offline: 'Hors ligne',
      away: 'Absent',
      busy: 'Occupé',
    },

    // Forms - REWRITTEN (plus humain)
    forms: {
      sessionName: 'Nom de la session',
      squadName: 'Nom de ta squad',
      description: 'Description',
      date: 'Date',
      time: 'Heure',
      duration: 'Durée',
      maxPlayers: 'Joueurs max',
      required: 'Requis',
      optional: 'Optionnel',
      errors: {
        required: 'Ce champ est obligatoire',
        invalidEmail: 'Email invalide',
        minLength: 'Minimum {min} caractères',
        maxLength: 'Maximum {max} caractères',
      },
    },

    // Notifications - REWRITTEN (gratifiantes, pas froides)
    notifications: {
      sessionCreated: 'Session créée ! Ton équipe est notifiée.',
      sessionUpdated: 'Session mise à jour',
      sessionCancelled: 'Session annulée',
      squadCreated: 'Squad créée ! Invite tes mates.',
      squadJoined: 'Bienvenue dans la squad',
      squadLeft: 'Tu as quitté la squad',
      inviteSent: 'Invitation envoyée',
      profileUpdated: 'Profil mis à jour',
    },

    // Vote & RSVP - NEW SECTION
    vote: {
      yes: 'Partant',
      no: 'Pas dispo',
      maybe: 'Peut-être',
      title: 'Vote pour le créneau',
      subtitle: 'Aide ton équipe à trouver le meilleur moment',
      leading: 'En tête',
      tied: 'Égalité',
      waiting: 'En attente de réponses',
      allVoted: 'Tout le monde a voté',
      changeVote: 'Changer de vote',
      finalizing: 'Finalisation en cours',
    },

    // Check-In - NEW SECTION
    checkin: {
      title: 'Check-in',
      subtitle: 'Confirme ta présence avant le lancement',
      ready: 'Je suis prêt',
      notReady: 'Pas encore prêt',
      waiting: 'En attente',
      allReady: 'Tout le monde est prêt',
      starting: 'On démarre',
      late: 'Je suis en retard',
      cantMake: 'Je ne peux pas venir',
    },

    // Premium - NEW SECTION
    premium: {
      title: 'Premium',
      subtitle: 'Débloquez tout le potentiel de votre squad',
      monthly: 'Mensuel',
      yearly: 'Annuel',
      perMonth: '/ mois',
      save: 'Économisez',
      features: {
        ai: 'Suggestions IA des meilleurs créneaux',
        stats: 'Stats avancées et analytics',
        history: 'Historique illimité',
        export: 'Export calendrier Google, Apple, Outlook',
        discord: 'Bot Discord automatique',
        roles: 'Rôles personnalisés (Coach, Manager...)',
        support: 'Support prioritaire',
      },
      cta: 'Passer Premium',
      trial: '7 jours gratuits',
      cancel: 'Annulation possible à tout moment',
      testimonials: {
        title: 'Ce que nos utilisateurs disent',
      },
    },

    // Smart Suggestions (AI) - NEW SECTION
    smartSuggestions: {
      title: 'Suggestions IA',
      subtitle: 'Les meilleurs créneaux pour votre squad',
      analyzing: 'Analyse de vos 10 dernières sessions...',
      confidence: 'Confiance',
      recommended: 'RECOMMANDÉ',
      reasons: {
        strongHistory: 'Historique fort',
        solidAlternative: 'Alternative solide',
        flexibleWeekend: 'Week-end flexible',
      },
      details: {
        attendance: 'Taux de présence',
        sessions: 'Sessions',
        available: 'Tous disponibles ce jour',
        topSlot: 'Slot le plus performant',
      },
      proposeSlot: 'Proposer ce créneau',
      manualOverride: 'Ou proposer manuellement',
    },

    // Advanced Stats - NEW SECTION
    advancedStats: {
      title: 'Stats avancées',
      subtitle: 'Analyses détaillées de vos performances',
      overview: 'Vue d\'ensemble',
      totalSessions: 'Sessions totales',
      attendance: 'Taux de présence',
      avgDuration: 'Durée moyenne',
      totalHours: 'Heures totales',
      bestDay: 'Meilleur jour',
      bestTime: 'Meilleure heure',
      streak: 'Série en cours',
      weeklyBreakdown: 'Répartition hebdomadaire',
      leaderboard: 'Classement fiabilité',
    },

    // Calendar Sync - NEW SECTION
    calendarSync: {
      title: 'Sync Calendrier',
      subtitle: 'Synchronisez vos sessions avec vos agendas',
      google: 'Google Calendar',
      apple: 'Apple Calendar',
      outlook: 'Outlook',
      connect: 'Connecter',
      disconnect: 'Déconnecter',
      connected: 'Connecté',
      synced: 'Synchronisé',
      exportICS: 'Télécharger .ics',
      autoSync: 'Synchronisation automatique',
      description: 'Vos sessions confirmées apparaîtront automatiquement',
    },

    // Empty States - NEW SECTION (jamais vides, toujours rassurants)
    emptyStates: {
      noSessions: {
        title: 'Aucune session prévue',
        description: 'Propose un créneau à ta squad',
        action: 'Proposer une session',
      },
      noSquads: {
        title: 'Crée ta première squad',
        description: 'Rassemble tes mates et organisez vos sessions',
        action: 'Créer ma squad',
      },
      noMembers: {
        title: 'Invite ton équipe',
        description: 'Partage le lien d\'invitation avec tes mates',
        action: 'Inviter',
      },
      noHistory: {
        title: 'Pas encore d\'historique',
        description: 'Jouez votre première session ensemble',
        action: 'Planifier',
      },
      noVotes: {
        title: 'En attente de votes',
        description: 'Dès que tout le monde vote, on finalise',
        action: 'Relancer',
      },
    },

    // Error States - NEW SECTION (jamais anxiogènes)
    errors: {
      generic: {
        title: 'Quelque chose a planté',
        description: 'Réessaye dans quelques secondes',
        action: 'Réessayer',
      },
      network: {
        title: 'Pas de connexion',
        description: 'Vérifie ta connexion internet',
        action: 'Réessayer',
      },
      notFound: {
        title: 'Page introuvable',
        description: 'Cette page n\'existe pas ou a été supprimée',
        action: 'Retour à l\'accueil',
      },
      unauthorized: {
        title: 'Accès refusé',
        description: 'Tu n\'as pas les permissions nécessaires',
        action: 'Retour',
      },
      sessionFull: {
        title: 'Session complète',
        description: 'Cette session a atteint le nombre maximum de joueurs',
        action: 'Retour',
      },
    },

    // Loading States - NEW SECTION (jamais silencieux)
    loadingStates: {
      creatingSession: 'Création de la session...',
      creatingSquad: 'Création de la squad...',
      analyzing: 'Analyse en cours...',
      syncing: 'Synchronisation...',
      loading: 'Chargement...',
      updating: 'Mise à jour...',
      deleting: 'Suppression...',
      joining: 'Connexion...',
    },

    // Confirmations - NEW SECTION (gratifiantes)
    confirmations: {
      sessionCreated: {
        title: 'Session créée',
        description: 'Ton équipe a été notifiée',
        action: 'Voir la session',
      },
      squadCreated: {
        title: 'Squad créée',
        description: 'Invite tes mates maintenant',
        action: 'Inviter',
      },
      voteSubmitted: {
        title: 'Vote enregistré',
        description: 'On attend les autres',
        action: 'OK',
      },
      checkedIn: {
        title: 'Check-in validé',
        description: 'Tu es prêt à jouer',
        action: 'Cool',
      },
      leftSquad: {
        title: 'Squad quittée',
        description: 'Tu peux toujours la rejoindre plus tard',
        action: 'Retour',
      },
    },

    // Onboarding - NEW SECTION (jamais long, toujours clair)
    onboarding: {
      welcome: {
        title: 'Bienvenue sur Squad Planner',
        description: 'Fini le chaos Discord. Place aux sessions qui comptent.',
        action: 'C\'est parti',
      },
      step1: {
        title: 'Crée ta squad',
        description: 'Rassemble tes mates habituels',
      },
      step2: {
        title: 'Propose des créneaux',
        description: 'Tout le monde vote pour le meilleur moment',
      },
      step3: {
        title: 'Check-in avant de jouer',
        description: 'Plus de no-show. Que des sessions réelles.',
      },
      skip: 'Passer',
      next: 'Continuer',
      finish: 'Commencer',
    },

    // CTA - NEW SECTION (verbes forts, orientés action)
    cta: {
      createSquad: 'Créer ma squad',
      proposeSession: 'Proposer un créneau',
      joinSquad: 'Rejoindre',
      inviteMembers: 'Inviter mon équipe',
      vote: 'Voter',
      checkIn: 'Je suis prêt',
      viewSession: 'Voir la session',
      viewSquad: 'Voir la squad',
      viewStats: 'Mes stats',
      upgradePremium: 'Passer Premium',
      connectCalendar: 'Connecter mon agenda',
      exportCalendar: 'Exporter',
      manageNotifications: 'Gérer les notifications',
      editProfile: 'Modifier mon profil',
      shareInvite: 'Partager l\'invitation',
    },

    // Tooltips - NEW SECTION (courtes explications contextuelles)
    tooltips: {
      reliability: 'Ton taux de présence aux sessions confirmées',
      streak: 'Nombre de sessions consécutives où tu étais présent',
      mvp: 'Nombre de fois élu MVP par ton équipe',
      confidence: 'Probabilité que ce créneau marche pour tout le monde',
      checkIn: 'Confirme ta présence 30 min avant le lancement',
      premium: 'Fonctionnalité Premium - Passe Premium pour y accéder',
    },
  },

  en: {
    // Navigation
    nav: {
      home: 'Home',
      sessions: 'Sessions',
      squads: 'Squads',
      profile: 'Profile',
    },

    // Home Screen - REWRITTEN
    home: {
      hero: {
        badge: '',
        title: 'Squad Planner',
        subtitle: 'No more \"we\'ll see\". Real sessions, real commitment.',
        stats: {
          sessions: 'Sessions',
          players: 'Players',
          reliability: 'Reliability',
        },
      },
      nextSession: {
        title: 'Next session',
        today: 'Today',
        tomorrow: 'Tomorrow',
        saturday: 'Saturday',
        sunday: 'Sunday',
        starting: 'Starting soon',
        join: 'Join',
        joinNow: 'Go',
        confirmed: 'ready',
      },
      mySquads: {
        title: 'My squads',
        viewAll: 'View all',
        seeAll: 'View all',
        responseNeeded: 'Tell us if you\'re coming',
        online: 'online',
        createNew: 'Create squad',
        createDescription: 'Build your team',
      },
      quickActions: {
        title: 'Quick actions',
        createSquad: 'Create squad',
        createSquadDesc: 'Build your team',
        proposeSession: 'Propose a time',
        proposeSessionDesc: 'Find a time that works',
        proposeDescription: 'Find a time that works',
        browseSquads: 'Explore squads',
        browseDescription: 'Join new teams',
        viewHistory: 'History',
        historyDescription: 'Your stats and performance',
      },
      emptyState: {
        title: 'Create your first squad',
        description: 'Gather your mates and organize sessions',
        action: 'Create squad',
      },
      title: 'Squad Planner',
      subtitle: 'Organize your gaming sessions',
      activeSquads: 'Active squads',
      upcomingSessions: 'Upcoming sessions',
      stats: {
        totalSessions: 'Sessions',
        hoursPlayed: 'Hours played',
        winRate: 'Wins',
        reliability: 'Reliability',
      },
      liveNow: 'LIVE NOW',
      createSquad: 'Create squad',
      viewAll: 'View all',
      noSessions: 'No upcoming sessions',
      noSquads: 'No active squads',
    },

    // Sessions Screen - REWRITTEN
    sessions: {
      title: 'My sessions',
      subtitle: 'Your upcoming matches and history',
      upcoming: 'Upcoming',
      past: 'Past',
      create: 'New session',
      filters: {
        all: 'All',
        today: 'Today',
        upcoming: 'Upcoming',
        week: 'This week',
        month: 'This month',
      },
      details: {
        game: 'Game',
        date: 'Date',
        time: 'Time',
        duration: 'Duration',
        players: 'Players',
        status: 'Status',
      },
      status: {
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed',
      },
      actions: {
        join: 'Join',
        leave: 'Leave',
        cancel: 'Cancel',
        edit: 'Edit',
      },
      stats: {
        title: 'Your stats',
        confirmed: 'Confirmed',
        pending: 'Pending',
        avgReliability: 'Average reliability',
      },
    },

    // Squads Screen - REWRITTEN
    squads: {
      title: 'My squads',
      mySquads: 'My squads',
      discover: 'Explore',
      create: 'Create squad',
      members: 'members',
      activeSessions: 'active sessions',
      join: 'Join',
      leave: 'Leave',
      manage: 'Manage',
      active: 'Active',
      noResults: 'No squads match',
      stats: {
        members: 'Members',
        sessions: 'Sessions',
        winRate: 'Wins',
        founded: 'Founded',
      },
      roles: {
        leader: 'Leader',
        admin: 'Admin',
        member: 'Member',
      },
    },

    // Profile Screen - REWRITTEN
    profile: {
      title: 'Profile',
      stats: 'Stats',
      settings: 'Settings',
      recentGames: 'Recent games',
      favoriteGames: 'Favorite games',
      level: 'Level',
      badges: {
        founder: 'Founder',
        veteran: 'Veteran',
        reliable: 'Reliable',
        champion: 'Champion',
        social: 'Social',
      },
      editProfile: 'Edit',
      signOut: 'Sign out',
      statsTitle: 'Your stats',
      achievementsTitle: 'Achievements',
      recentActivity: 'Recent activity',
    },

    // Game Selection - REWRITTEN
    games: {
      title: 'Choose your game',
      search: 'Search...',
      popular: 'Popular',
      recent: 'Recent',
      all: 'All games',
      categories: {
        fps: 'FPS',
        moba: 'MOBA',
        br: 'Battle Royale',
        rpg: 'RPG',
        sports: 'Sports',
        strategy: 'Strategy',
        coop: 'Co-op',
        casual: 'Casual',
      },
    },

    // Common - REWRITTEN
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Continue',
      finish: 'Finish',
      loading: 'Loading...',
      error: 'Error',
      success: 'Perfect',
      online: 'Online',
      offline: 'Offline',
      away: 'Away',
      busy: 'Busy',
    },

    // Forms - REWRITTEN
    forms: {
      sessionName: 'Session name',
      squadName: 'Squad name',
      description: 'Description',
      date: 'Date',
      time: 'Time',
      duration: 'Duration',
      maxPlayers: 'Max players',
      required: 'Required',
      optional: 'Optional',
      errors: {
        required: 'This field is required',
        invalidEmail: 'Invalid email',
        minLength: 'Minimum {min} characters',
        maxLength: 'Maximum {max} characters',
      },
    },

    // Notifications - REWRITTEN
    notifications: {
      sessionCreated: 'Session created! Your team is notified.',
      sessionUpdated: 'Session updated',
      sessionCancelled: 'Session cancelled',
      squadCreated: 'Squad created! Invite your mates.',
      squadJoined: 'Welcome to the squad',
      squadLeft: 'You left the squad',
      inviteSent: 'Invitation sent',
      profileUpdated: 'Profile updated',
    },

    // Vote & RSVP - NEW SECTION
    vote: {
      yes: 'In',
      no: 'Out',
      maybe: 'Maybe',
      title: 'Vote for a time',
      subtitle: 'Help your team find the best time',
      leading: 'Leading',
      tied: 'Tied',
      waiting: 'Waiting for responses',
      allVoted: 'Everyone voted',
      changeVote: 'Change vote',
      finalizing: 'Finalizing',
    },

    // Check-In - NEW SECTION
    checkin: {
      title: 'Check-in',
      subtitle: 'Confirm your presence before launch',
      ready: 'I\'m ready',
      notReady: 'Not ready yet',
      waiting: 'Waiting',
      allReady: 'Everyone\'s ready',
      starting: 'Let\'s go',
      late: 'Running late',
      cantMake: 'Can\'t make it',
    },

    // Premium - NEW SECTION
    premium: {
      title: 'Premium',
      subtitle: 'Unlock your squad\'s full potential',
      monthly: 'Monthly',
      yearly: 'Yearly',
      perMonth: '/ month',
      save: 'Save',
      features: {
        ai: 'AI-powered time suggestions',
        stats: 'Advanced stats and analytics',
        history: 'Unlimited history',
        export: 'Calendar export (Google, Apple, Outlook)',
        discord: 'Automatic Discord bot',
        roles: 'Custom roles (Coach, Manager...)',
        support: 'Priority support',
      },
      cta: 'Go Premium',
      trial: '7-day free trial',
      cancel: 'Cancel anytime',
      testimonials: {
        title: 'What our users say',
      },
    },

    // Smart Suggestions (AI) - NEW SECTION
    smartSuggestions: {
      title: 'AI Suggestions',
      subtitle: 'Best times for your squad',
      analyzing: 'Analyzing your last 10 sessions...',
      confidence: 'Confidence',
      recommended: 'RECOMMENDED',
      reasons: {
        strongHistory: 'Strong history',
        solidAlternative: 'Solid alternative',
        flexibleWeekend: 'Flexible weekend',
      },
      details: {
        attendance: 'Attendance rate',
        sessions: 'Sessions',
        available: 'Everyone available this day',
        topSlot: 'Top performing slot',
      },
      proposeSlot: 'Propose this time',
      manualOverride: 'Or propose manually',
    },

    // Advanced Stats - NEW SECTION
    advancedStats: {
      title: 'Advanced stats',
      subtitle: 'Detailed performance analysis',
      overview: 'Overview',
      totalSessions: 'Total sessions',
      attendance: 'Attendance rate',
      avgDuration: 'Average duration',
      totalHours: 'Total hours',
      bestDay: 'Best day',
      bestTime: 'Best time',
      streak: 'Current streak',
      weeklyBreakdown: 'Weekly breakdown',
      leaderboard: 'Reliability leaderboard',
    },

    // Calendar Sync - NEW SECTION
    calendarSync: {
      title: 'Calendar Sync',
      subtitle: 'Sync sessions with your calendars',
      google: 'Google Calendar',
      apple: 'Apple Calendar',
      outlook: 'Outlook',
      connect: 'Connect',
      disconnect: 'Disconnect',
      connected: 'Connected',
      synced: 'Synced',
      exportICS: 'Download .ics',
      autoSync: 'Automatic sync',
      description: 'Confirmed sessions will appear automatically',
    },

    // Empty States - NEW SECTION
    emptyStates: {
      noSessions: {
        title: 'No upcoming sessions',
        description: 'Propose a time to your squad',
        action: 'Propose session',
      },
      noSquads: {
        title: 'Create your first squad',
        description: 'Gather your mates and organize sessions',
        action: 'Create squad',
      },
      noMembers: {
        title: 'Invite your team',
        description: 'Share the invite link with your mates',
        action: 'Invite',
      },
      noHistory: {
        title: 'No history yet',
        description: 'Play your first session together',
        action: 'Plan',
      },
      noVotes: {
        title: 'Waiting for votes',
        description: 'Once everyone votes, we\'ll finalize',
        action: 'Remind',
      },
    },

    // Error States - NEW SECTION
    errors: {
      generic: {
        title: 'Something went wrong',
        description: 'Try again in a few seconds',
        action: 'Retry',
      },
      network: {
        title: 'No connection',
        description: 'Check your internet connection',
        action: 'Retry',
      },
      notFound: {
        title: 'Page not found',
        description: 'This page doesn\'t exist or was removed',
        action: 'Back to home',
      },
      unauthorized: {
        title: 'Access denied',
        description: 'You don\'t have the necessary permissions',
        action: 'Back',
      },
      sessionFull: {
        title: 'Session full',
        description: 'This session reached maximum players',
        action: 'Back',
      },
    },

    // Loading States - NEW SECTION
    loadingStates: {
      creatingSession: 'Creating session...',
      creatingSquad: 'Creating squad...',
      analyzing: 'Analyzing...',
      syncing: 'Syncing...',
      loading: 'Loading...',
      updating: 'Updating...',
      deleting: 'Deleting...',
      joining: 'Joining...',
    },

    // Confirmations - NEW SECTION
    confirmations: {
      sessionCreated: {
        title: 'Session created',
        description: 'Your team has been notified',
        action: 'View session',
      },
      squadCreated: {
        title: 'Squad created',
        description: 'Invite your mates now',
        action: 'Invite',
      },
      voteSubmitted: {
        title: 'Vote recorded',
        description: 'Waiting for others',
        action: 'OK',
      },
      checkedIn: {
        title: 'Checked in',
        description: 'You\'re ready to play',
        action: 'Cool',
      },
      leftSquad: {
        title: 'Left squad',
        description: 'You can always rejoin later',
        action: 'Back',
      },
    },

    // Onboarding - NEW SECTION
    onboarding: {
      welcome: {
        title: 'Welcome to Squad Planner',
        description: 'No more Discord chaos. Real sessions, real commitment.',
        action: 'Let\'s go',
      },
      step1: {
        title: 'Create your squad',
        description: 'Gather your regular mates',
      },
      step2: {
        title: 'Propose times',
        description: 'Everyone votes for the best time',
      },
      step3: {
        title: 'Check-in before playing',
        description: 'No more no-shows. Only real sessions.',
      },
      skip: 'Skip',
      next: 'Continue',
      finish: 'Start',
    },

    // CTA - NEW SECTION
    cta: {
      createSquad: 'Create squad',
      proposeSession: 'Propose time',
      joinSquad: 'Join',
      inviteMembers: 'Invite team',
      vote: 'Vote',
      checkIn: 'I\'m ready',
      viewSession: 'View session',
      viewSquad: 'View squad',
      viewStats: 'My stats',
      upgradePremium: 'Go Premium',
      connectCalendar: 'Connect calendar',
      exportCalendar: 'Export',
      manageNotifications: 'Manage notifications',
      editProfile: 'Edit profile',
      shareInvite: 'Share invite',
    },

    // Tooltips - NEW SECTION
    tooltips: {
      reliability: 'Your attendance rate at confirmed sessions',
      streak: 'Consecutive sessions where you showed up',
      mvp: 'Times voted MVP by your team',
      confidence: 'Probability this time works for everyone',
      checkIn: 'Confirm your presence 30 min before launch',
      premium: 'Premium feature - Upgrade to access',
    },
  },
} as const;

export type TranslationKeys = typeof translations.fr;
