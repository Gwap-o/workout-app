import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import type { NetlifyUser } from '@/types';

interface AuthContextType {
  user: NetlifyUser | null;
  loading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<NetlifyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init();

    // Get current user
    const currentUser = netlifyIdentity.currentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for login
    netlifyIdentity.on('login', (user?: NetlifyUser) => {
      setUser(user || null);
      netlifyIdentity.close();
    });

    // Listen for logout
    netlifyIdentity.on('logout', () => {
      setUser(null);
    });

    // Cleanup listeners
    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, []);

  const login = () => netlifyIdentity.open('login');
  const signup = () => netlifyIdentity.open('signup');
  const logout = () => netlifyIdentity.logout();

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
