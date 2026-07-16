"use client";

import { createContext, useContext, useState } from "react";

export interface FilterContextType {
  dinas: string | null;
  activatedDinas: string | null;
  namaDinas: string | null;
  periode: string | null;
  tahun: string | null;
  activatedTahun: string | null;
  bulan: string | null;
  activatedBulan: string | null;
  levelRole: string | null;
  activatedLevelRole: string | null;
  namaPegawai: string | null;
  activatedNamaPegawai: string | null;
  setDinas: (v: string | null) => void;
  setActivatedDinas: (v: string | null) => void;
  setNamaDinas: (v: string | null) => void;
  setPeriode: (v: string | null) => void;
  setTahun: (v: string | null) => void;
  setActivatedTahun: (v: string | null) => void;
  setBulan: (v: string | null) => void;
  setActivatedBulan: (v: string | null) => void;
  setLevelRole: (v: string | null) => void;
  setActivatedLevelRole: (v: string | null) => void;
  setNamaPegawai: (v: string | null) => void;
  setActivatedNamaPegawai: (v: string | null) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [dinas, setDinas] = useState<string | null>(null);
  const [activatedDinas, setActivatedDinas] = useState<string | null>(null);
  const [namaDinas, setNamaDinas] = useState<string | null>(null);
  const [periode, setPeriode] = useState<string | null>(null);
  const [tahun, setTahun] = useState<string | null>(null);
  const [activatedTahun, setActivatedTahun] = useState<string | null>(null);
  const [bulan, setBulan] = useState<string | null>(null);
  const [activatedBulan, setActivatedBulan] = useState<string | null>(null);
  const [levelRole, setLevelRole] = useState<string | null>(null);
  const [activatedLevelRole, setActivatedLevelRole] = useState<string | null>(null);
  const [namaPegawai, setNamaPegawai] = useState<string | null>(null);
  const [activatedNamaPegawai, setActivatedNamaPegawai] = useState<string | null>(null);

  return (
    <FilterContext.Provider
      value={{
        dinas,
        activatedDinas,
        namaDinas,
        periode,
        tahun,
        activatedTahun,
        bulan,
        activatedBulan,
        levelRole,
        activatedLevelRole,
        namaPegawai,
        activatedNamaPegawai,
        setDinas,
        setActivatedDinas,
        setNamaDinas,
        setPeriode,
        setTahun,
        setActivatedTahun,
        setBulan,
        setActivatedBulan,
        setLevelRole,
        setActivatedLevelRole,
        setNamaPegawai,
        setActivatedNamaPegawai,
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
