import { ROLES } from "@/constants/roles";

export const getHeaderColor = (level: string | undefined) => {
    switch (level) {
        case ROLES.LEVEL_1: return 'bg-red-600 text-white';
        case ROLES.LEVEL_2: return 'bg-blue-600 text-white';
        case ROLES.LEVEL_3: return 'bg-green-600 text-white';
        case ROLES.LEVEL_4: return 'bg-orange-600 text-white';
        default: return 'bg-emerald-500 text-white';
    }
};
