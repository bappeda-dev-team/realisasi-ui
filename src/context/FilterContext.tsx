"use client";

import { createContext, useContext, useState } from "react";

export interface FilterContextType {
  dinas: string | null;
  periode: string | null;
  tahun: string | null;
  bulan: string | null;
  setDinas: (v: string | null) => void;
  setPeriode: (v: string | null) => void;
  setTahun: (v: string | null) => void;
  setBulan: (v: string | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [dinas, setDinas] = useState<string | null>(null);
  const [periode, setPeriode] = useState<string | null>(null);
  const [tahun, setTahun] = useState<string | null>(null);
  const [bulan, setBulan] = useState<string | null>(null);

  return (
    <FilterContext.Provider
      value={{
        dinas,
        periode,
        tahun,
        bulan,
        setDinas,
        setPeriode,
        setTahun,
        setBulan,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (context == undefined) {
    throw new Error("useFIlterContext must be used within a FilterProvider");
  }
  return context;
}
