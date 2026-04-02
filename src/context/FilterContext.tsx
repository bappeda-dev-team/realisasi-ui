"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { useUserContext } from "@/context/UserContext";

export interface FilterState {
  dinas: string | null;
  periode: string | null;
  tahun: string | null;
  bulan: string | null;
}

const FILTER_COOKIE_KEY = "selectedCookie";

const EMPTY_FILTER: FilterState = {
  dinas: null,
  periode: null,
  tahun: null,
  bulan: null,
};

interface FilterCookiePayload {
  userId: string;
  draft: FilterState;
  active: FilterState;
  isActivated: boolean;
}

export interface FilterContextType {
  draftFilter: FilterState;
  activeFilter: FilterState;
  isActivated: boolean;
  setDraftDinas: (v: string | null) => void;
  setDraftPeriode: (v: string | null) => void;
  setDraftTahun: (v: string | null) => void;
  setDraftBulan: (v: string | null) => void;
  hasRequiredDraft: boolean;
  hasRequiredActive: boolean;
  activateFilter: () => boolean;
  resetActivation: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, loading, lastLoginAt } = useUserContext();
  const [draftFilter, setDraftFilter] = useState<FilterState>(EMPTY_FILTER);
  const [activeFilter, setActiveFilter] = useState<FilterState>(EMPTY_FILTER);
  const [isActivated, setIsActivated] = useState(false);
  const draftFilterRef = useRef<FilterState>(EMPTY_FILTER);

  const isFilterRequiredComplete = (filter: FilterState) =>
    Boolean(filter.dinas && filter.periode && filter.tahun && filter.bulan);

  const hasRequiredDraft = isFilterRequiredComplete(draftFilter);
  const hasRequiredActive =
    isActivated && isFilterRequiredComplete(activeFilter);

  const setDraftDinas = (v: string | null) => {
    setDraftFilter((prev) => {
      const next = { ...prev, dinas: v };
      draftFilterRef.current = next;
      return next;
    });
  };

  const setDraftPeriode = (v: string | null) => {
    setDraftFilter((prev) => {
      const next = { ...prev, periode: v, tahun: null };
      draftFilterRef.current = next;
      return next;
    });
  };

  const setDraftTahun = (v: string | null) => {
    setDraftFilter((prev) => {
      const next = { ...prev, tahun: v };
      draftFilterRef.current = next;
      return next;
    });
  };

  const setDraftBulan = (v: string | null) => {
    setDraftFilter((prev) => {
      const next = { ...prev, bulan: v };
      draftFilterRef.current = next;
      return next;
    });
  };

  const resetActivation = () => {
    setIsActivated(false);
    setActiveFilter(EMPTY_FILTER);
  };

  const activateFilter = () => {
    const snapshot = draftFilterRef.current;
    if (!isFilterRequiredComplete(snapshot)) return false;

    setActiveFilter(snapshot);
    setIsActivated(true);
    return true;
  };

  useEffect(() => {
    if (loading) return;

    if (!user) {
      draftFilterRef.current = EMPTY_FILTER;
      setDraftFilter(EMPTY_FILTER);
      resetActivation();
      Cookies.remove(FILTER_COOKIE_KEY);
      return;
    }

    draftFilterRef.current = EMPTY_FILTER;
    setDraftFilter(EMPTY_FILTER);
    resetActivation();

    const cookieStr = Cookies.get(FILTER_COOKIE_KEY);
    if (!cookieStr) return;

    try {
      const parsed: FilterCookiePayload = JSON.parse(cookieStr);
      if (parsed.userId !== user.id) return;

      if (parsed.draft) {
        draftFilterRef.current = parsed.draft;
        setDraftFilter(parsed.draft);
      }

      if (parsed.isActivated && isFilterRequiredComplete(parsed.active)) {
        setActiveFilter(parsed.active);
        setIsActivated(true);
      }
    } catch {}
  }, [user, loading]);

  useEffect(() => {
    if (!lastLoginAt) return;

    draftFilterRef.current = EMPTY_FILTER;
    setDraftFilter(EMPTY_FILTER);
    resetActivation();
    Cookies.remove(FILTER_COOKIE_KEY);
  }, [lastLoginAt]);

  useEffect(() => {
    if (!user) return;

    const cookiePayload: FilterCookiePayload = {
      userId: user.id,
      draft: draftFilter,
      active: activeFilter,
      isActivated,
    };

    Cookies.set(FILTER_COOKIE_KEY, JSON.stringify(cookiePayload), {
      expires: 30,
    });
  }, [user, draftFilter, activeFilter, isActivated]);

  return (
    <FilterContext.Provider
      value={{
        draftFilter,
        activeFilter,
        isActivated,
        setDraftDinas,
        setDraftPeriode,
        setDraftTahun,
        setDraftBulan,
        hasRequiredDraft,
        hasRequiredActive,
        activateFilter,
        resetActivation,
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
