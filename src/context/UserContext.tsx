"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authenticate } from "@/lib/auth";
import { User } from "@/types";

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
      try {
        const user = await authenticate();
        setUser(user);
        setError(null);
      } catch (_) {
        const msg = _ instanceof Error ? _.message : "Unknown error occurred";
        if (msg.toLowerCase().includes("silakan login")) {
          setError("Silakan login.");
        } else {
          setError(
            "Gagal autentikasi, pastikan username dan password sudah benar.",
          );
        }
        setUser(null);
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
