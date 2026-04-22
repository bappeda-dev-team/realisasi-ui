export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN_OPD: 'admin_opd',
  LEVEL_1: 'level_1',
  LEVEL_2: 'level_2',
  LEVEL_3: 'level_3',
  LEVEL_4: 'level_4',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const INDIVIDU_ROLES = [
  ROLES.LEVEL_1,
  ROLES.LEVEL_2,
  ROLES.LEVEL_3,
  ROLES.LEVEL_4,
] as const;

export type IndividuRole = typeof INDIVIDU_ROLES[number];