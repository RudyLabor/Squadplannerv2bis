import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Login screen re-enabled
const BYPASS_AUTH = false;

// Vérifie si un token existe dans localStorage (synchrone)
const hasStoredToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  const tokenKey = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
  return !!tokenKey && !!localStorage.getItem(tokenKey);
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [tokenExists, setTokenExists] = useState(false);

  // Vérification initiale du token
  useEffect(() => {
    const exists = hasStoredToken();
    setTokenExists(exists);
    setIsCheckingToken(false);
  }, []);

  // Bypass auth check if flag is set
  if (BYPASS_AUTH) {
    return <>{children}</>;
  }

  // Afficher le loader pendant le chargement initial ou si on attend l'auth
  if (loading || isCheckingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#08090a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5e6dd2]"></div>
      </div>
    );
  }

  // Si pas d'utilisateur mais un token existe, attendre (l'auth est peut-être en cours)
  if (!user && tokenExists) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#08090a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5e6dd2]"></div>
      </div>
    );
  }

  // Pas d'utilisateur et pas de token → rediriger vers login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
