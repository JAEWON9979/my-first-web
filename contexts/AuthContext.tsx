"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { getFriendlyErrorMessage } from "@/lib/errors";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadSession() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          const errorText = sessionError.message.toLowerCase();

          if (errorText.includes("invalid refresh token") || errorText.includes("refresh token not found")) {
            await supabase.auth.signOut();
            setUser(null);
            setError(null);
          } else {
            setError(getFriendlyErrorMessage(sessionError));
          }

          setIsLoading(false);
          return;
        }

        setUser(session?.user ?? null);
      } catch (caughtError) {
        const errorText = caughtError instanceof Error ? caughtError.message.toLowerCase() : "";

        if (errorText.includes("invalid refresh token") || errorText.includes("refresh token not found")) {
          await supabase.auth.signOut();
          setUser(null);
          setError(null);
        } else {
          setError(getFriendlyErrorMessage(caughtError));
        }
      } finally {
        setIsLoading(false);
      }
    }

    void loadSession();

    // 인증 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setError(null);
    });

    // Cleanup: 구독 해제
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
    }),
    [user, isLoading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth는 AuthProvider 안에서 사용해야 합니다.");
  }

  return context;
}
