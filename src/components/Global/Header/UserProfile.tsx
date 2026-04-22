import { User } from "@/types";
import { useUserContext } from "@/context/UserContext";
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

  const handleLogout = async () => {
    clearSessionId();
    setUser(null);
    setError(null);
    await logout();
  };

  return (
    <div className="flex items-center gap-2 font-bold rounded-lg cursor-pointer py-1 px-3 hover:text-black text-white hover:bg-white border border-white">
      <span>{user?.firstName}</span>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1 px-2 py-1 hover:bg-red-500 hover:text-white rounded"
        title="Logout"
      >
        <TbLogout size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}
