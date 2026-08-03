"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import { canAccessRoute, getDefaultPage } from "@/lib/rbac";
import { ROLES } from "@/constants/roles";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, opdSelected } = useUserContext();

  const needsOpdSelection =
    user &&
    !opdSelected &&
    (user.roles.includes(ROLES.SUPER_ADMIN) ||
      user.roles.includes(ROLES.ADMIN_OPD) ||
      user.roles.includes(ROLES.LEVEL_1) ||
      user.roles.includes(ROLES.LEVEL_2) ||
      user.roles.includes(ROLES.LEVEL_3) ||
      user.roles.includes(ROLES.LEVEL_4));

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/");
      return;
    }

    // Blokir akses jika super_admin/admin_opd belum pilih OPD
    if (needsOpdSelection) {
      router.push("/");
      return;
    }

    const canAccess = canAccessRoute(pathname, user);

    if (!canAccess) {
      const defaultPage = getDefaultPage(user);
      router.push(defaultPage);
      return;
    }
  }, [user, loading, pathname, router, needsOpdSelection]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">Memuat...</div>
        </div>
      </div>
    );
  }

  if (needsOpdSelection) {
    return null;
  }

  const canAccess = user ? canAccessRoute(pathname, user) : false;

  if (!canAccess) {
    return null;
  }

  return <>{children}</>;
};