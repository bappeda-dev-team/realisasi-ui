"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { canAccessRoute, getDefaultPage } from "@/lib/rbac";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUserContext();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/");
      return;
    }

    const canAccess = canAccessRoute(pathname, user);

    if (!canAccess) {
      const defaultPage = getDefaultPage(user);
      router.push(defaultPage);
      return;
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">Memuat...</div>
        </div>
      </div>
    );
  }

  const canAccess = user ? canAccessRoute(pathname, user) : false;

  if (!canAccess) {
    return null;
  }

  return <>{children}</>;
};