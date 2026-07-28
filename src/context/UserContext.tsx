"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authenticate } from "@/lib/auth";
import { User } from "@/types";
import {
  clearSessionId,
  getSessionId,
  SESSION_EXPIRED_EVENT,
} from "@/lib/session";
import Cookies from "js-cookie";

const OPD_SELECTED_COOKIE = "opdSelected";

interface OpdSelectedCookie {
  selected: boolean;
  locked: boolean;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (err: string | null) => void;
  logout: (reason?: string) => void;
  lastLoginAt: number | null;
  setLastLoginAt: (n: number | null) => void;
  opdSelected: boolean;
  opdLocked: boolean;
  setOpdSelected: (v: boolean) => void;
  setOpdLocked: (v: boolean) => void;
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
  opdSelected: false,
  opdLocked: false,
  setOpdSelected: () => {},
  setOpdLocked: () => {},
});

export function UserProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLoginAt, setLastLoginAt] = useState<number | null>(null);

  // Select opd for super_admin / admin_opd
  const readOpdCookie = (): OpdSelectedCookie => {
    if (typeof document === 'undefined') return { selected: false, locked: false };
    const raw = Cookies.get(OPD_SELECTED_COOKIE);
    if (!raw) return { selected: false, locked: false };
    try {
      return JSON.parse(raw) as OpdSelectedCookie;
    } catch {
      return { selected: false, locked: false };
    }
  };

  const [opdSelected, setOpdSelectedState] = useState<boolean>(() => readOpdCookie().selected);
  const [opdLocked, setOpdLockedState] = useState<boolean>(() => readOpdCookie().locked);

  const setOpdSelected = useCallback((v: boolean) => {
    setOpdSelectedState(v);
    const current = readOpdCookie();
    Cookies.set(OPD_SELECTED_COOKIE, JSON.stringify({ ...current, selected: v }), { expires: 7 });
  }, []);

  const setOpdLocked = useCallback((v: boolean) => {
    setOpdLockedState(v);
    const current = readOpdCookie();
    Cookies.set(OPD_SELECTED_COOKIE, JSON.stringify({ ...current, locked: v }), { expires: 7 });
  }, []);

  const logout = (reason = "Session habis, silakan login kembali.") => {
    clearSessionId();
    setUser(null);
    setError(reason);
    setLastLoginAt(null);
    setOpdSelectedState(false);
    setOpdLockedState(false);
    Cookies.remove(OPD_SELECTED_COOKIE);
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
        opdSelected,
        opdLocked,
        setOpdSelected,
        setOpdLocked,
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
