import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

const API_URL = 'http://localhost:3000';

interface User {
  id: number;
  username: string;
  email: string;
  calendarToken: string;
  calendarUrl: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('calsync_token'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Inloggning misslyckades');
        return false;
      }

      localStorage.setItem('calsync_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError('Kunde inte ansluta till servern');
      return false;
    }
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registrering misslyckades');
        return false;
      }

      localStorage.setItem('calsync_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      setError('Kunde inte ansluta till servern');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('calsync_token');
    setToken(null);
    setUser(null);
  };

  // Fetch user if token exists
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    async function fetchMe() {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          logout();
        }
      } catch (err) {
        console.error(err);
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    fetchMe();
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
