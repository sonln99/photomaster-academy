"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AuthUser {
  id: string;
  name: string | null;
  image: string | null;
  email: string | null;
  provider: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithTikTok: () => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithTikTok: () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function mapSupabaseUser(user: User): AuthUser {
  const meta = user.user_metadata || {};
  return {
    id: user.id,
    name: meta.full_name || meta.name || null,
    image: meta.avatar_url || meta.picture || null,
    email: user.email || null,
    provider: user.app_metadata?.provider || "google",
  };
}

function getTikTokSession(): AuthUser | null {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((c) => c.startsWith("tiktok_session="));
    if (!cookie) return null;
    const data = JSON.parse(decodeURIComponent(cookie.split("=").slice(1).join("=")));
    if (data?.id && data?.name) return { ...data, email: null };
    return null;
  } catch {
    return null;
  }
}

function clearTikTokSession() {
  document.cookie = "tiktok_session=; path=/; max-age=0";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(getTikTokSession());
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapSupabaseUser(session.user));
      } else {
        setUser(getTikTokSession());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  }, []);

  const signInWithTikTok = useCallback(() => {
    window.location.href = "/api/auth/tiktok";
  }, []);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    clearTikTokSession();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithTikTok, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}
