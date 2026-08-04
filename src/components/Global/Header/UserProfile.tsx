import { User } from "@/types";
import { useUserContext } from "@/context/UserContext";
import { useFilterContext } from "@/context/FilterContext";
import { clearSessionId } from "@/lib/session";
import { getResolvedLevel } from "@/lib/rbac";
import { TbLogout } from "react-icons/tb";
import { logout as serverLogout } from "./logout";

export default function UserProfile({ user, hideOpd }: { user: User, hideOpd?: boolean }) {
  const { setUser, setError } = useUserContext();
  const { periode, activatedTahun, activatedBulan, namaDinas, activatedLevelRole } = useFilterContext();
  const level = getResolvedLevel(user, activatedLevelRole) ?? user?.roles?.[0] ?? "unknown";

  const getMonthName = (monthValue: string | null) => {
    if (!monthValue) return "";
    const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
    const idx = parseInt(monthValue, 10) - 1;
    return months[idx] ?? monthValue;
  };

  const bulanName = getMonthName(activatedBulan);

  const handleLogout = async () => {
    clearSessionId();
    setUser(null);
    setError(null);
    await serverLogout();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 font-bold rounded-lg cursor-pointer py-1 px-3 hover:text-black text-white hover:bg-white border border-white">
        <span>{periode}</span>
        <span className="text-white/70">|</span>
        <span>{activatedTahun}</span>
        <span className="text-white/70">|</span>
        <span>{bulanName}</span>
        {!hideOpd && (
          <>
            <span className="text-white/70">|</span>
            <span>{namaDinas ?? 'OPD belum dipilih'}</span>
          </>
        )}
        <span className="text-white/70">|</span>
        <span>{user?.firstName}</span>
        <span className="text-white/70">|</span>
        <span>{level}</span>
      </div>
      <div className="font-bold rounded-lg cursor-pointer py-1 px-3 hover:text-black text-white hover:bg-white border border-white">
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-2 py-1 hover:bg-red-500 hover:text-white rounded"
          title="Logout"
        >
          <TbLogout size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
