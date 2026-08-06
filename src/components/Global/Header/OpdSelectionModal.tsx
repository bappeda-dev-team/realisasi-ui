"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useUserContext } from "@/context/UserContext";
import { useFilterContext } from "@/context/FilterContext";
import { useFetchData } from "@/hooks/useFetchData";
import { ButtonSky, ButtonRed } from "@/components/Global/Button/button";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { clearSessionId } from "@/lib/session";
import { logout as serverLogout } from "./logout";
import { getDefaultPage, isIndividuUser } from "@/lib/rbac";
import Cookies from "js-cookie";

interface DinasResponse {
  code: number;
  status: string;
  data: ListDinas[];
}

interface ListDinas {
  kode_opd: string;
  nama_opd: string;
}

interface LabelDropdown {
  value: string;
  label: string;
}

interface SelectedCookie {
  dinas: LabelDropdown | null;
  periode: LabelDropdown | null;
  tahun: LabelDropdown | null;
  bulan: LabelDropdown | null;
  levelRole?: LabelDropdown | null;
  namaPegawai?: LabelDropdown | null;
}

const LEVEL_ROLE_OPTIONS: LabelDropdown[] = [
  { label: "Level 1", value: "LEVEL_1" },
  { label: "Level 2", value: "LEVEL_2" },
  { label: "Level 3", value: "LEVEL_3" },
  { label: "Level 4", value: "LEVEL_4" },
];

export default function OpdSelectionModal() {
  const router = useRouter();
  const { setOpdSelected, setOpdLocked, setUser, setError, user } = useUserContext();
  const {
    setDinas,
    setActivatedDinas,
    setNamaDinas,
    setLevelRole,
    setActivatedLevelRole,
  } = useFilterContext();
  const [selectedOpd, setSelectedOpd] = useState<LabelDropdown | null>(null);
  const [selectedLevelRole, setSelectedLevelRole] = useState<LabelDropdown | null>(null);
  const [loading, setLoading] = useState(false);

  // Hanya user individu (level 1-4) yang wajib memilih Level Role di popup.
  // Super admin / admin opd memilih Level Role nanti di dropdown header.
  const isIndividu = isIndividuUser(user);

  const { data: dataDinas, loading: loadingDinas } = useFetchData<DinasResponse>({
    url: `/api/periode/list_opd`,
  });

  const dinasOptions: LabelDropdown[] =
    dataDinas?.data?.map((d) => ({
      value: d.kode_opd,
      label: d.nama_opd,
    })) ?? [];

  // Semua user (super_admin, admin_opd, level_1 s/d level_4)
  // bisa memilih role Level 1 sampai Level 4
  const levelRoleOptions: LabelDropdown[] = user ? LEVEL_ROLE_OPTIONS : [];

  const handleSelectOpd = async () => {
    if (!selectedOpd) return;
    setLoading(true);

    // Set OPD di FilterContext
    setDinas(selectedOpd.value);
    setActivatedDinas(selectedOpd.value);
    setNamaDinas(selectedOpd.label);

    // Set Level Role di FilterContext (hanya untuk user individu)
    if (isIndividu && selectedLevelRole) {
      setLevelRole(selectedLevelRole.value);
      setActivatedLevelRole(selectedLevelRole.value);
    }

    // Persist OPD & Level Role ke cookie selectedCookie
    const existingCookie = Cookies.get("selectedCookie");
    const levelRoleValue = isIndividu ? (selectedLevelRole ?? null) : null;
    let cookieData: SelectedCookie = {
      dinas: selectedOpd,
      periode: null,
      tahun: null,
      bulan: null,
      levelRole: levelRoleValue,
    };
    if (existingCookie) {
      try {
        const parsed = JSON.parse(existingCookie) as SelectedCookie;
        cookieData = { ...parsed, dinas: selectedOpd, levelRole: levelRoleValue };
      } catch {
        // gunakan default
      }
    }
    Cookies.set("selectedCookie", JSON.stringify(cookieData), { expires: 30 });

    // Tandai OPD sudah dipilih & terkunci
    setOpdSelected(true);
    setOpdLocked(true);

    setLoading(false);
    const defaultPage = getDefaultPage(user);
    router.push(defaultPage);
  };

  const handleLogout = async () => {
    clearSessionId();
    setUser(null);
    setError(null);
    await serverLogout();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60]">
      <div className="fixed inset-0 bg-black opacity-70" />

      <div className="relative bg-white p-6 rounded-lg w-[420px] z-10">
        <h1 className="text-xl mb-2 text-blue-500 font-semibold text-center">
          Pilih OPD
        </h1>
        <p className="text-sm text-gray-500 text-center mb-4">
          Silakan pilih OPD untuk melanjutkan.
        </p>

        <Select
          instanceId="opd-selection-dropdown"
          className="text-sm"
          options={dinasOptions}
          isLoading={loadingDinas}
          value={selectedOpd}
          onChange={(opt) => setSelectedOpd(opt)}
          placeholder={loadingDinas ? "Memuat data OPD..." : "Pilih Dinas/OPD"}
          isSearchable
        />

        {isIndividu && (
          <div className="mt-3">
            <Select
              instanceId="opd-selection-level-role"
              className="text-sm"
              options={levelRoleOptions}
              value={selectedLevelRole}
              onChange={(opt) => setSelectedLevelRole(opt)}
              placeholder="Pilih Level Role"
              isSearchable
            />
          </div>
        )}

        <div className="flex gap-2 mt-5">
          <ButtonRed
            type="button"
            className="flex-1"
            onClick={handleLogout}
          >
            Logout
          </ButtonRed>
          <ButtonSky
            type="button"
            className="flex-1"
            disabled={!selectedOpd || (isIndividu && !selectedLevelRole) || loading}
            onClick={handleSelectOpd}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingButtonClip color="white" />
                Memproses...
              </span>
            ) : isIndividu ? (
              "Pilih OPD dan Role"
            ) : (
              "Pilih OPD"
            )}
          </ButtonSky>
        </div>
      </div>
    </div>
  );
}
