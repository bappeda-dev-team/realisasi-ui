"use client";

import { useState, useEffect, useCallback } from "react";

type EffectiveType = "slow-2g" | "2g" | "3g" | "4g";

interface NetworkStatus {
  isOnline: boolean;
  effectiveType: EffectiveType;
  isWeak: boolean;
}

const getEffectiveType = (): EffectiveType => {
  const conn = (navigator as any).connection;
  if (conn && conn.effectiveType) {
    return conn.effectiveType as EffectiveType;
  }
  return "4g";
};

const isNetworkWeak = (online: boolean, type: EffectiveType): boolean => {
  if (!online) return true;
  return type === "slow-2g" || type === "2g";
};

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    const online = navigator.onLine;
    const effectiveType = getEffectiveType();
    return {
      isOnline: online,
      effectiveType,
      isWeak: isNetworkWeak(online, effectiveType),
    };
  });

  const updateStatus = useCallback(() => {
    const online = navigator.onLine;
    const effectiveType = getEffectiveType();
    setStatus({
      isOnline: online,
      effectiveType,
      isWeak: isNetworkWeak(online, effectiveType),
    });
  }, []);

  useEffect(() => {
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    const conn = (navigator as any).connection;
    if (conn) {
      conn.addEventListener("change", updateStatus);
    }

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      if (conn) {
        conn.removeEventListener("change", updateStatus);
      }
    };
  }, [updateStatus]);

  return status;
};
