"use client";

import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import {
  TbSignal4G,
  TbSignal2G,
  TbSignalE,
  TbWifiOff,
} from "react-icons/tb";

export const NetworkIndicator = () => {
  const { isOnline, effectiveType, isWeak } = useNetworkStatus();

  if (isWeak) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg border border-red-200">
        <TbWifiOff className="text-red-500" size={35} />
      </div>
    );
  }

  const getIcon = () => {
    switch (effectiveType) {
      case "4g":
        return <TbSignal4G className="text-green-500" size={35} />;
      case "3g":
        return <TbSignal2G className="text-yellow-500" size={35} />;
      case "2g":
        return <TbSignalE className="text-orange-500" size={35} />;
      case "slow-2g":
        return <TbWifiOff className="text-red-500" size={35} />;
      default:
        return <TbSignal4G className="text-green-500" size={35} />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-full p-2 shadow-lg border border-gray-200">
      {getIcon()}
    </div>
  );
};
