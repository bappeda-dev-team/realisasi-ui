import Login from "./Login";
import { useUserContext } from "@/context/UserContext";

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

export default function UserProfile() {
  const { user: user, loading: loading } = useUserContext();

  if (loading) {
    return <div className="p-5">Loading...</div>;
  }

  // LOGIN STATE
  if (!user) {
    return (
      <>
        <Login autoOpen={true} />
      </>
    );
  }

  // TODO: make dropdown with user profile and logout
  return (
    <div className="flex items-center gap-1 font-bold rounded-lg cursor-pointer py-1 px-5 hover:text-black text-white hover:bg-white border border-white">
      {user?.firstName}
    </div>
  );
}
