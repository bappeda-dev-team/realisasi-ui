import { User } from '@/types';
import { ROLES, INDIVIDU_ROLES } from '@/constants/roles';

function hasRole(user: User | null, role: string): boolean {
  return Boolean(user?.roles.includes(role));
}

export function canSelectAllOpdFilters(user: User | null): boolean {
  if (!user) return false;
  return hasRole(user, ROLES.SUPER_ADMIN) || hasRole(user, ROLES.ADMIN_OPD);
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
    hasRole(user, ROLES.LEVEL_1) ||
    hasRole(user, ROLES.LEVEL_2) ||
    hasRole(user, ROLES.LEVEL_3) ||
    hasRole(user, ROLES.LEVEL_4)
  );
}

export function canAccessIndividu(user: User | null): boolean {
  if (!user) return false;
  return (
    hasRole(user, ROLES.SUPER_ADMIN) ||
    hasRole(user, ROLES.ADMIN_OPD) ||
    user.roles.some((role) => INDIVIDU_ROLES.includes(role as any))
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

export function canEditIndividuRekinRealisasi(user: User | null): boolean {
  if (!user) return false;
  return user.roles.some((role) => INDIVIDU_ROLES.includes(role as any));
}

export function canEditIndividuRenaksiRealisasi(user: User | null): boolean {
  if (!user) return false;
  return user.roles.some((role) => INDIVIDU_ROLES.includes(role as any));
}

export function canEditIndividuRenjaRealisasi(user: User | null): boolean {
  if (!user) return false;
  if (hasRole(user, ROLES.LEVEL_1)) {
    return false;
  }
  if (
    hasRole(user, ROLES.LEVEL_2) ||
    hasRole(user, ROLES.LEVEL_3)
  ) {
    return true;
  }
  return false;
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

  return menus;
}
