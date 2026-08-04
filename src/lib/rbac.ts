import { User } from '@/types';
import { ROLES, INDIVIDU_ROLES } from '@/constants/roles';

function hasRole(user: User | null, role: string): boolean {
  return Boolean(user?.roles.includes(role));
}

/**
 * Mengidentifikasi user individu (level 1-4) di production.
 * Response user-info untuk level 1-3 di production hanya berisi
 * roles Keycloak default (tanpa level_*), namun tetap memiliki `nip`
 * dan merupakan user individu. Fallback tetap memakai roles level_*
 * untuk environment lama.
 */
export function isIndividuUser(user: User | null): boolean {
  if (!user) return false;
  // Super admin / admin opd bukan user individu, walau punya nip
  if (hasRole(user, ROLES.SUPER_ADMIN) || hasRole(user, ROLES.ADMIN_OPD)) {
    return false;
  }
  return Boolean(
    user.nip ||
    user.roles.some((role) => INDIVIDU_ROLES.includes(role as any))
  );
}

/**
 * Mendapatkan level role user. Prioritas:
 * 1. `activatedLevelRole` (pilihan Level Role di dropdown/modal) — dipakai
 *    untuk semua user termasuk level 1-3 di production.
 * 2. role level_* milik user (perilaku lama).
 */
export function getResolvedLevel(user: User | null, activatedLevelRole?: string | null): string | undefined {
  if (activatedLevelRole) {
    return activatedLevelRole.toLowerCase();
  }
  return user?.roles.find((r) => r.startsWith("level_"));
}

export function canSelectAllOpdFilters(user: User | null): boolean {
  if (!user) return false;
  return (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD) ||
    isIndividuUser(user)
  );
}

export function canAccessPemda(user: User | null): boolean {
  if (!user) return false;
  return hasRole(user, ROLES.SUPER_ADMIN);
}

export function canAccessOpd(user: User | null): boolean {
  if (!user) return false;
  return (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD) ||
    isIndividuUser(user)
  );
}

export function canAccessIndividu(user: User | null): boolean {
  if (!user) return false;
  return (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD) ||
    isIndividuUser(user)
  );
}

export function canAccessOpdRealisasi(user: User | null): boolean {
  if (!user) return false;
  return hasRole(user, ROLES.SUPER_ADMIN) || hasRole(user, ROLES.ADMIN_OPD);
}

export function canAccessOpdStrategic(user: User | null): boolean {
  return canAccessOpd(user);
}

export function canAccessOpdOperational(user: User | null): boolean {
  if (!user) return false;
  return hasRole(user, ROLES.SUPER_ADMIN) || hasRole(user, ROLES.ADMIN_OPD);
}

export function canAccessIndividuRekin(user: User | null): boolean {
  if (!user) return false;
  return canAccessIndividu(user);
}

export function canAccessIndividuRenja(user: User | null): boolean {
  if (!user) return false;
  if (hasRole(user, ROLES.SUPER_ADMIN) || hasRole(user, ROLES.ADMIN_OPD)) {
    return true;
  }
  if (hasRole(user, ROLES.LEVEL_4)) {
    return false;
  }
  return canAccessIndividu(user);
}

export function canAccessIndividuRenaksi(user: User | null): boolean {
  return canAccessIndividu(user);
}

export function canEditPemdaRealisasi(user: User | null): boolean {
  if (!user) return false;
  return hasRole(user, ROLES.SUPER_ADMIN) || hasRole(user, ROLES.ADMIN_OPD);
}

export function canEditOpdRealisasi(user: User | null): boolean {
  if (!user) return false;
  return hasRole(user, ROLES.SUPER_ADMIN) || hasRole(user, ROLES.ADMIN_OPD);
}

export function canEditIndividuRekinRealisasi(
  user: User | null,
  activatedLevelRole?: string | null,
): boolean {
  if (!user) return false;
  // Super admin / admin opd tidak bisa edit realisasi di halaman Individu
  if (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD)
  ) {
    return false;
  }
  const level = getResolvedLevel(user, activatedLevelRole);
  return Boolean(level && INDIVIDU_ROLES.includes(level as any));
}

export function canEditIndividuRenaksiRealisasi(
  user: User | null,
  activatedLevelRole?: string | null,
): boolean {
  if (!user) return false;
  // Super admin / admin opd tidak bisa edit realisasi di halaman Individu
  if (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD)
  ) {
    return false;
  }
  const level = getResolvedLevel(user, activatedLevelRole);
  return Boolean(level && INDIVIDU_ROLES.includes(level as any));
}

export function canEditIndividuRenjaRealisasi(
  user: User | null,
  activatedLevelRole?: string | null,
): boolean {
  if (!user) return false;
  // Super admin / admin opd tidak bisa edit realisasi di halaman Individu
  if (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD)
  ) {
    return false;
  }
  const level = getResolvedLevel(user, activatedLevelRole);
  if (level === ROLES.LEVEL_1) {
    return false;
  }
  return level === ROLES.LEVEL_2 || level === ROLES.LEVEL_3;
}

export function getDefaultPage(user: User | null): string {
  if (!user) return '/';
  if (canAccessPemda(user)) return '/Pemda';
  if (canAccessOpd(user)) return '/Opd';
  if (canAccessIndividuRekin(user)) return '/Individu';
  if (canAccessIndividu(user)) return '/Individu';
  return '/';
}

export function canAccessRoute(pathname: string, user: User | null): boolean {
  if (!user) return false;
  if (pathname.startsWith('/Pemda')) return canAccessPemda(user);
  if (pathname.startsWith('/Opd/Tujuan') || pathname.startsWith('/Opd/Sasaran')) {
    return canAccessOpdStrategic(user);
  }
  if (pathname.startsWith('/Opd/Renja') || pathname.startsWith('/Opd/Renaksi')) {
    return canAccessOpdOperational(user);
  }
  if (pathname.startsWith('/Opd')) return canAccessOpd(user);
  if (pathname.startsWith('/Individu/Rekin-Individu')) return canAccessIndividuRekin(user);
  if (pathname.startsWith('/Individu/Renja')) return canAccessIndividuRenja(user);
  if (pathname.startsWith('/Individu/Renaksi')) return canAccessIndividuRenaksi(user);
  if (pathname.startsWith('/Individu')) return canAccessIndividuRekin(user);
  return true;
}

export function getAccessibleMenus(user: User | null): { name: string; href: string }[] {
  const menus: { name: string; href: string }[] = [];

  if (canAccessPemda(user)) {
    menus.push({ name: 'Pemda', href: '/Pemda' });
  }
  if (canAccessOpd(user)) {
    menus.push({ name: 'OPD', href: '/Opd' });
  }
  if (canAccessIndividu(user)) {
    menus.push({ name: 'Individu', href: '/Individu' });
  }

  if (user) {
    menus.push({ name: 'Laporan', href: '/Laporan' });
  }

  return menus;
}

/**
 * Apakah user wajib memilih OPD + Level Role setelah login?
 * Berlaku untuk super_admin, admin_opd, dan seluruh user individu
 * (termasuk level 1-3 di production yang roles-nya hanya memuat role
 * Keycloak default namun memiliki `nip`).
 */
export function needsOpdSelection(user: User | null): boolean {
  if (!user) return false;
  return (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD) ||
    isIndividuUser(user)
  );
}
