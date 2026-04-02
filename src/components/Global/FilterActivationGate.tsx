"use client";

import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";

export default function FilterActivationGate({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { user, loading } = useUserContext();
  const { hasRequiredActive } = useFilterContext();

  if (loading) {
    return (
      <div className="p-5 bg-slate-100 border border-slate-300 rounded text-slate-700 my-5">
        Memuat sesi...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-5 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 my-5">
        Silakan login terlebih dahulu.
      </div>
    );
  }

  if (!hasRequiredActive) {
    return (
      <div className="p-5 bg-red-100 border border-red-300 rounded text-red-700 my-5">
        Pilih dinas, periode, tahun, dan bulan lalu klik tombol Aktifkan.
      </div>
    );
  }

  return <>{children}</>;
}
