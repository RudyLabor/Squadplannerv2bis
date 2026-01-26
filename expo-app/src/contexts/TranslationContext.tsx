import React, { createContext, useContext, useState } from 'react';

const translations = {
  fr: {
    // Auth
    'auth.login': 'Se connecter',
    'auth.signup': 'Créer un compte',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.name': 'Nom',
    'auth.logout': 'Déconnexion',
    
    // Navigation
    'nav.home': 'Accueil',
    'nav.squads': 'Squads',
    'nav.sessions': 'Sessions',
    'nav.profile': 'Profil',
    
    // Home
    'home.title': 'Squad Planner',
    'home.subtitle': 'Organisez vos sessions gaming',
    'home.nextSession': 'Prochaine session',
    'home.mySquads': 'Mes squads',
    'home.createSquad': 'Créer une squad',
    
    // Squads
    'squads.title': 'Mes Squads',
    'squads.create': 'Nouvelle squad',
    'squads.members': 'membres',
    'squads.nextSession': 'Prochaine session',
    
    // Sessions
    'sessions.title': 'Sessions',
    'sessions.upcoming': 'À venir',
    'sessions.past': 'Passées',
    'sessions.create': 'Proposer un créneau',
    'sessions.rsvp.yes': 'Je suis partant',
    'sessions.rsvp.no': 'Pas dispo',
    
    // Profile
    'profile.title': 'Profil',
    'profile.edit': 'Modifier',
    'profile.reliabilityScore': 'Score de fiabilité',
    'profile.level': 'Niveau',
    'profile.premium': 'Premium',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.confirm': 'Confirmer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
  },
  en: {
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.logout': 'Logout',
    
    // Navigation
    'nav.home': 'Home',
    'nav.squads': 'Squads',
    'nav.sessions': 'Sessions',
    'nav.profile': 'Profile',
    
    // Home
    'home.title': 'Squad Planner',
    'home.subtitle': 'Organize your gaming sessions',
    'home.nextSession': 'Next session',
    'home.mySquads': 'My squads',
    'home.createSquad': 'Create squad',
    
    // Squads
    'squads.title': 'My Squads',
    'squads.create': 'New squad',
    'squads.members': 'members',
    'squads.nextSession': 'Next session',
    
    // Sessions
    'sessions.title': 'Sessions',
    'sessions.upcoming': 'Upcoming',
    'sessions.past': 'Past',
    'sessions.create': 'Propose time',
    'sessions.rsvp.yes': 'I\'m in',
    'sessions.rsvp.no': 'Not available',
    
    // Profile
    'profile.title': 'Profile',
    'profile.edit': 'Edit',
    'profile.reliabilityScore': 'Reliability score',
    'profile.level': 'Level',
    'profile.premium': 'Premium',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.confirm': 'Confirm',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
  },
};

interface TranslationContextType {
  language: 'fr' | 'en';
  t: (key: string) => string;
  setLanguage: (lang: 'fr' | 'en') => void;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'fr',
  t: (key) => key,
  setLanguage: () => {},
});

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.fr] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
};
