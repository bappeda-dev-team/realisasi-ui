"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authenticate } from "@/lib/auth";
import { User } from "@/types";
import Cookies from "js-cookie";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setError: (err: string | null) => void;
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

  useEffect(() => {
    const fetchUser = async () => {
      const sessionId = Cookies.get("sessionId");

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
        setError(
          "Gagal autentikasi, pastikan username dan password sudah benar.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        setUser,
        setError,
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
