import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

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
        const authenticatedUser = await getMeRequest();

        setUser(authenticatedUser);
      } catch {
        removeAccessToken();
        setUser(null);
        queryClient.clear();
      } finally {
        setIsLoading(false);
      }
    }

    bootstrap();
  }, [queryClient]);

  function signIn(token: string, nextUser: User) {
    queryClient.clear();

    setAccessToken(token);
    setUser(nextUser);
  }

  async function signOut() {
    try {
      await logoutRequest();
    } catch {
      // Mesmo se o backend falhar no logout, limpamos a sessão local.
    } finally {
      removeAccessToken();
      setUser(null);
      queryClient.clear();
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