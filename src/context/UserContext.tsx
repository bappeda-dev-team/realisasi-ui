"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authenticate } from "@/lib/auth";
import { User } from "@/types";
import {
  clearSessionId,
  getSessionId,
  SESSION_EXPIRED_EVENT,
} from "@/lib/session";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (err: string | null) => void;
  logout: (reason?: string) => void;
  lastLoginAt: number | null;
  setLastLoginAt: (n: number | null) => void;
}

// context
const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  setUser: () => {},
  setError: () => {},
  logout: () => {},
  lastLoginAt: null,
  setLastLoginAt: () => {},
});

export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLoginAt, setLastLoginAt] = useState<number | null>(null);

  const logout = (reason = "Session habis, silakan login kembali.") => {
    clearSessionId();
    setUser(null);
    setError(reason);
    setLastLoginAt(null);
  };

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const sessionId = getSessionId();

      if (!sessionId) {
        setUser(null);
        setError("Silakan login.");
        setLoading(false);
        return;
      }

      try {
        const user = await authenticate(sessionId);
        setUser(user);
        setError(null);
      } catch (_) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        setError,
        logout,
        lastLoginAt,
        setLastLoginAt,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used witihin a UserProvider");
  }
  return context;
}
