import { ROLES } from "@/constants/roles";
import { User } from "@/types";

export const getHeaderColor = (level: string | undefined) => {
    switch (level) {
        case ROLES.LEVEL_1: return 'bg-red-600 text-white';
        case ROLES.LEVEL_2: return 'bg-blue-600 text-white';
        case ROLES.LEVEL_3: return 'bg-green-600 text-white';
        case ROLES.LEVEL_4: return 'bg-orange-600 text-white';
        default: return 'bg-emerald-500 text-white';
    }
};

export const getHeaderFillColor = (level: string | undefined): [number, number, number] => {
    switch (level) {
        case ROLES.LEVEL_1: return [220, 38, 38];
        case ROLES.LEVEL_2: return [37, 99, 235];
        case ROLES.LEVEL_3: return [22, 163, 74];
        case ROLES.LEVEL_4: return [234, 88, 12];
        default: return [16, 185, 129];
    }
};

/**
 * Menentukan level efektif untuk pewarnaan header tabel.
 * - Super admin / admin OPD yang memilih level role di TopFilter
 *   akan memakai level yang dipilih (activatedLevelRole).
 * - Selain itu, memakai role level_* milik user (perilaku lama).
 */
export const getEffectiveUserLevel = (
    user: User | null | undefined,
    activatedLevelRole: string | null | undefined,
): string | undefined => {
    // Semua user (super_admin, admin_opd, level_1 s/d level_4)
    // memakai level role yang dipilih (activatedLevelRole).
    if (user && activatedLevelRole) {
        return activatedLevelRole.toLowerCase();
    }
    return user?.roles.find((r) => r.startsWith("level_"));
};
