'use client'

import { createContext, useContext } from "react"

interface BrandingContextType {
  title: string;
  clientName: string;
  branding: {
    title: string;
    client: string;
  }
}

const appName = process.env.NEXT_PUBLIC_APP_NAME || "";
const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "";

// context
const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <BrandingContext.Provider value={{ title: appName, clientName: clientName, branding: { title: appName, client: clientName } }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBrandingContext() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error("useBrandingContext must be used witihin a BrandingProvider")
  }
  return context;
}
