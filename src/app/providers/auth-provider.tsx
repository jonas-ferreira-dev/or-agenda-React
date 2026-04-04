import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from '@/features/auth/hooks/use-auth';
import type { User } from '@/features/auth/types/auth';
import { getMeRequest } from '@/features/auth/services/me';
import { logoutRequest } from '@/features/auth/services/logout';
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/services/api/storage';

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = getAccessToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getMeRequest();
        setUser(response.user);
      } catch {
        removeAccessToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, []);

  function signIn(token: string, nextUser: User) {
    setAccessToken(token);
    setUser(nextUser);
  }

  async function signOut() {
    try {
      await logoutRequest();
    } catch {
    } finally {
      removeAccessToken();
      setUser(null);
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      signIn,
      signOut,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}