import { User } from "@/types";
import { useUserContext } from "@/context/UserContext";
import { useFilterContext } from "@/context/FilterContext";
import { usePathname } from "next/navigation";
import { clearSessionId } from "@/lib/session";
import { TbLogout } from "react-icons/tb";
import { logout } from "./logout";

// TODO: map this with user profile
// const roleColors: Record<string, string> = {
//   super_admin: "bg-amber-100 text-amber-700",
//   admin_opd: "bg-sky-100 text-sky-700",
//   admin_kecamatan: "bg-sky-100 text-sky-700",
//   reviewer: "bg-teal-100 text-teal-700",
//   level_1: "bg-red-100 text-red-700",
//   level_2: "bg-blue-100 text-blue-700",
//   level_3: "bg-green-100 text-green-700",
//   level_4: "bg-stone-100 text-stone-700",
//   staff: "bg-stone-100 text-stone-700",
// };

export default function UserProfile({ user }: { user: User }) {
  const { setUser, setError } = useUserContext();
  const { periode, activatedTahun, activatedBulan, namaDinas } = useFilterContext();
  const pathname = usePathname();
  const isOpdPage = pathname.startsWith('/Opd');
  const isPemdaPage = pathname.startsWith('/Pemda');
  const level = user?.roles?.[0] ?? "unknown";

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
    await logout();
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 font-bold rounded-lg cursor-pointer py-1 px-3 hover:text-black text-white hover:bg-white border border-white">
        <span>{periode}</span>
        <span className="text-white/70">|</span>
        <span>{activatedTahun}</span>
        <span className="text-white/70">|</span>
        <span>{bulanName}</span>
        {isOpdPage && (
          <>
            <span className="text-white/70">|</span>
            <span>{namaDinas ?? 'OPD belum dipilih'}</span>
          </>
        )}
        {isPemdaPage && (
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
