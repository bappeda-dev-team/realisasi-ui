'use client'

import { createContext, useContext } from "react"

interface ApiUrlContextType {
  url: string | undefined;
  token?: string | undefined;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// gunakan saat development saja
const TOKEN = process.env.NEXT_PUBLIC_API_ACCESS_TOKEN

// context
const ApiUrlContext = createContext<ApiUrlContextType | undefined>(undefined);

export function ApiUrlProvider({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <ApiUrlContext.Provider value={{ url: API_URL, token: TOKEN }}>
      {children}
    </ApiUrlContext.Provider>
  );
}

export function useApiUrlContext() {
  const context = useContext(ApiUrlContext);
  if (context === undefined) {
    throw new Error("useApiUrlContext must be used witihin a ApiUrlProvider")
  }
  return context;
}
