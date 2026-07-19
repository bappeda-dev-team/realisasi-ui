"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useBrandingContext } from "@/context/BrandingContext";
import { useFilterContext } from "@/context/FilterContext";
import Select from "react-select";
import Cookies from "js-cookie";
import { ToastSuccess } from "@/components/Global/Alert";
import { User } from "@/types";
import { canAccessPemda, canSelectAllOpdFilters } from "@/lib/rbac";
import { useFetchData } from "@/hooks/useFetchData";
import { useUserContext } from "@/context/UserContext";

interface LabelDropdown {
  value: string;
  label: string;
}

interface PeriodeDropdown {
  value: string;
  label: string;
  tahun_awal: number;
  tahun_akhir: number;
}

interface SelectedCookie {
  dinas: LabelDropdown | null;
  periode: LabelDropdown | null;
  tahun: LabelDropdown | null;
  bulan: LabelDropdown | null;
  levelRole?: LabelDropdown | null;
  namaPegawai?: LabelDropdown | null;
}

interface FilterProps {
  user: User | null;
  disableOpdLock?: boolean;
  forceOpdLock?: boolean;
  hideOpd?: boolean;
}

interface DinasResponse {
  code: number;
  status: string;
  data: ListDinas[];
}

interface ListDinas {
  kode_opd: string;
  nama_opd: string;
}

interface PeriodeResponse {
  code: number;
  status: string;
  data: ListPeriode[];
}

interface ListPeriode {
  tahun_awal: number;
  tahun_akhir: number;
}

interface PegawaiData {
  id: number;
  nip: string;
  nama_pegawai: string;
  status_pegawai: string;
}

export default function TopFilter({ user, disableOpdLock, forceOpdLock, hideOpd }: FilterProps) {
  const { branding } = useBrandingContext();
  const {
    dinas,
    periode,
    tahun,
    setActivatedTahun,
    bulan,
    setDinas,
    setActivatedDinas,
    setNamaDinas,
    setPeriode,
    setTahun,
    setBulan,
    setActivatedBulan,
    levelRole,
    setLevelRole,
    setActivatedLevelRole,
    namaPegawai,
    setNamaPegawai,
    setActivatedNamaPegawai,
  } = useFilterContext();
  const { lastLoginAt } = useUserContext();
  const [ShowToast, setShowToast] = useState(false);

  const [dinasOptions, setDinasOptions] = useState<LabelDropdown[]>([]);
  const [periodeOptions, setPeriodeOptions] = useState<PeriodeDropdown[]>([]);
  const [tahunOptions, setTahunOptions] = useState<LabelDropdown[]>([]);
  const [bulanOptions, setBulanOptions] = useState<LabelDropdown[]>([]);
  const [levelRoleOptions, setLevelRoleOptions] = useState<LabelDropdown[]>([]);
  const [namaPegawaiOptions, setNamaPegawaiOptions] = useState<LabelDropdown[]>([]);

  const [loadingTahun, setLoadingTahun] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);

  const isSuperAdmin = user ? canAccessPemda(user) : false;
  const isAdminOpd = user ? user.roles.includes('admin_opd') : false;
  const canEditOpd = user ? canSelectAllOpdFilters(user) : false;
  const userKodeOpd = user?.kode_opd;

  const effectivelyCanEditOpd = (forceOpdLock && userKodeOpd && !isSuperAdmin && !isAdminOpd) ? false : canEditOpd;

  const {
    data: dataDinas,
    loading: loadingDinas,
    error: errorDinas,
  } = useFetchData<DinasResponse>({
    url: `/api/periode/list_opd`,
    trigger: fetchTrigger,
  });

  const {
    data: dataPeriode,
    loading: loadingPeriode,
    error: errorPeriode,
  } = useFetchData<PeriodeResponse>({
    url: `/api/periode/periode`,
    trigger: fetchTrigger,
  });

  const {
    data: dataPegawai,
    loading: loadingPegawai,
    error: errorPegawai,
  } = useFetchData<PegawaiData[]>({
    url: `/api/v1/realisasi/rekin/pegawai`,
    trigger: fetchTrigger,
  });
  // ----------------------------
  // FETCH AWAL (DINAS, PERIODE, TAHUN)
  // ----------------------------
  useEffect(() => {
    loadBulan();
  }, []);

  // ----------------------------
  // RE-FETCH SETELAH LOGIN
  // ----------------------------
  useEffect(() => {
    if (lastLoginAt) {
      setFetchTrigger((prev) => prev + 1);
    }
  }, [lastLoginAt]);

  // ----------------------------
  // DROPDOWN DINAS (OPD)
  // ----------------------------
  useEffect(() => {
    if (dataDinas?.data) {
      let options = dataDinas.data.map((d) => ({
        value: d.kode_opd,
        label: d.nama_opd,
      }));

      if (!effectivelyCanEditOpd && !disableOpdLock && userKodeOpd) {
        options = options.filter((opt) => opt.value === userKodeOpd);
      }

      setDinasOptions(options);
    }
  }, [dataDinas, effectivelyCanEditOpd, disableOpdLock, userKodeOpd]);

  // ----------------------------
  // DROPDOWN PERIODE
  // ----------------------------
  useEffect(() => {
    if (dataPeriode?.data) {
      setPeriodeOptions(
        dataPeriode.data
          .sort((a, b) => a.tahun_awal - b.tahun_awal)
          .map((d) => {
            const tahunAwalAkhir = `${d.tahun_awal}-${d.tahun_akhir}`;
            return {
              value: tahunAwalAkhir,
              label: tahunAwalAkhir,
              tahun_awal: d.tahun_awal,
              tahun_akhir: d.tahun_akhir,
            };
          }),
      );
    }
  }, [dataPeriode]);

  // ----------------------------
  // DROPDOWN PEGAWAI
  // ----------------------------
  useEffect(() => {
    if (dataPegawai && Array.isArray(dataPegawai)) {
      setNamaPegawaiOptions(
        dataPegawai.map((p) => ({
          value: p.nip?.replace(/-$/, ""),
          label: p.nama_pegawai,
        }))
      );
    }
  }, [dataPegawai]);

  // ----------------------------
  // DROPDOWN TAHUN
  // ----------------------------
  useEffect(() => {
    if (!periode) return;

    const selected = periodeOptions.find((p) => p.value === periode);
    if (!selected) return;

    // generate tahun sesuai periode
    const tahunList = [];
    for (let t = selected.tahun_awal; t <= selected.tahun_akhir; t++) {
      tahunList.push({
        value: t.toString(),
        label: `Tahun ${t}`,
      });
    }

    setTahunOptions(tahunList);
    setTahun(null);
  }, [periode, periodeOptions]);

  async function loadBulan() {
    const resp = [
      { label: "Januari", value: "1" },
      { label: "Februrari", value: "2" },
      { label: "Maret", value: "3" },
      { label: "April", value: "4" },
      { label: "Mei", value: "5" },
      { label: "Juni", value: "6" },
      { label: "Juli", value: "7" },
      { label: "Agustus", value: "8" },
      { label: "September", value: "9" },
      { label: "Oktober", value: "10" },
      { label: "November", value: "11" },
      { label: "Desember", value: "12" },
    ];

    setBulanOptions(resp);

    // Dummy options for Level Role since API is not provided
    setLevelRoleOptions([
      { label: "Level 1", value: "LEVEL_1" },
      { label: "Level 2", value: "LEVEL_2" },
      { label: "Level 3", value: "LEVEL_3" },
      { label: "Level 4", value: "LEVEL_4" },
    ]);
  }

  // ----------------------------
  // RESTORE DARI COOKIE
  // ----------------------------
  useEffect(() => {
    const cookieStr = Cookies.get("selectedCookie");
    if (!cookieStr) return;

    try {
      const cookie: SelectedCookie = JSON.parse(cookieStr);
      setDinas(cookie.dinas?.value ?? null);
      setActivatedDinas(cookie.dinas?.value ?? null);
      setNamaDinas(cookie.dinas?.label ?? null);
      setPeriode(cookie.periode?.value ?? null);
      setTahun(cookie.tahun?.value ?? null);
      setActivatedTahun(cookie.tahun?.value ?? null);
      setBulan(cookie.bulan?.value ?? null);
      setActivatedBulan(cookie.bulan?.value ?? null);
      setLevelRole(cookie.levelRole?.value ?? null);
      setActivatedLevelRole(cookie.levelRole?.value ?? null);
      setNamaPegawai(cookie.namaPegawai?.value ?? null);
      setActivatedNamaPegawai(cookie.namaPegawai?.value ?? null);
    } catch { }
  }, [periodeOptions]);

  // ----------------------------
  // AUTO SELECT OPD FOR NON-EDIT USERS (LEVEL 1-4)
  // ----------------------------
  useEffect(() => {
    if (!effectivelyCanEditOpd && !disableOpdLock && userKodeOpd && dinasOptions.length > 0) {
      const userOpd = dinasOptions.find((opt) => opt.value === userKodeOpd);
      if (userOpd) {
        setDinas(userOpd.value);
        setActivatedDinas(userOpd.value);
        setNamaDinas(userOpd.label);
      }
    }
  }, [dinasOptions, effectivelyCanEditOpd, disableOpdLock, userKodeOpd]);

  // ----------------------------
  // SIMPAN COOKIE
  // ----------------------------
  function handleActivate() {
    const selectedDinas = dinasOptions.find((x) => x.value === dinas);
    const cookieValue: SelectedCookie = {
      dinas: selectedDinas ?? null,
      periode: periodeOptions.find((x) => x.value === periode) ?? null,
      tahun: tahunOptions.find((x) => x.value === tahun) ?? null,
      bulan: bulanOptions.find((x) => x.value === bulan) ?? null,
      levelRole: levelRoleOptions.find((x) => x.value === levelRole) ?? null,
      namaPegawai: namaPegawaiOptions.find((x) => x.value === namaPegawai) ?? null,
    };

    Cookies.set("selectedCookie", JSON.stringify(cookieValue), {
      expires: 30,
    });
    setActivatedDinas(dinas);
    setNamaDinas(selectedDinas?.label ?? null);
    setActivatedTahun(tahun);
    setActivatedBulan(bulan);
    setActivatedLevelRole(levelRole);
    setActivatedNamaPegawai(namaPegawai);
    setShowToast(true);
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between text-sm">
      <ToastSuccess
        isOpen={ShowToast}
        onClose={() => setShowToast(false)}
        message="Filter diaktifkan"
      />
      <div className="flex gap-2 items-center">
        <Image src={branding.logo} alt="logo" width={40} height={40} />
        <div className="d-grid gap-2 items-center">
          <h3>{branding.title}</h3>
          <h5>{branding.client}</h5>
        </div>
      </div>

      {user && (
        <div className="flex flex-col sm:flex-row items-center gap-2 md:w-auto ml-auto">
          {/* PILIH DINAS */}
          {!hideOpd && (
            <Select
              instanceId="select-dinas"
              className="text-sm w-full sm:w-64"
              options={dinasOptions}
              isLoading={loadingDinas}
              value={dinasOptions.find((x) => x.value === dinas) ?? null}
              onChange={(opt) => setDinas(opt?.value ?? null)}
              placeholder={loadingDinas ? "Memuat..." : "Pilih Dinas/OPD"}
              isSearchable
              isClearable={effectivelyCanEditOpd || disableOpdLock}
              isDisabled={!effectivelyCanEditOpd && !disableOpdLock}
            />
          )}

          {/* PILIH PERIODE */}
          <Select
            instanceId="select-periode"
            className="text-sm w-full sm:w-56"
            options={periodeOptions}
            isLoading={loadingPeriode}
            value={periodeOptions.find((x) => x.value === periode) ?? null}
            onChange={(opt) => setPeriode(opt?.value ?? null)}
            placeholder={loadingPeriode ? "Memuat..." : "Pilih Periode"}
            isSearchable
            isClearable
          />

          {/* PILIH TAHUN */}
          <Select
            instanceId="select-tahun"
            className="text-sm w-full sm:w-44"
            options={tahunOptions}
            isLoading={loadingTahun}
            value={tahunOptions.find((x) => x.value === tahun) ?? null}
            onChange={(opt) => setTahun(opt?.value ?? null)}
            placeholder={loadingTahun ? "Memuat..." : "Pilih Tahun"}
            isSearchable
            isClearable
          />

          {/* PILIH BULAN */}
          <Select
            instanceId="select-bulan"
            className="text-sm w-full sm:w-44"
            options={bulanOptions}
            value={bulanOptions.find((x) => x.value === bulan) ?? null}
            onChange={(opt) => setBulan(opt?.value ?? null)}
            placeholder="Bulan"
            isSearchable
            isClearable
          />

          {forceOpdLock && (isSuperAdmin || isAdminOpd) && (
            <>
              {/* PILIH LEVEL ROLE */}
              <Select
                instanceId="select-level-role"
                className="text-sm w-full sm:w-44"
                options={levelRoleOptions}
                value={levelRoleOptions.find((x) => x.value === levelRole) ?? null}
                onChange={(opt) => setLevelRole(opt?.value ?? null)}
                placeholder="Level Role"
                isSearchable
                isClearable
              />

              {/* PILIH NAMA PEGAWAI */}
              <Select
                instanceId="select-nama-pegawai"
                className="text-sm w-full sm:w-44"
                options={namaPegawaiOptions}
                isLoading={loadingPegawai}
                value={namaPegawaiOptions.find((x) => x.value === namaPegawai) ?? null}
                onChange={(opt) => setNamaPegawai(opt?.value ?? null)}
                placeholder={loadingPegawai ? "Memuat..." : "Nama Pegawai"}
                isSearchable
                isClearable
              />
            </>
          )}

          <button
            className="bg-gray-700 text-white px-4 py-2.5 rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-700 transition"
            onClick={handleActivate}
          >
            Aktifkan
          </button>
        </div>
      )}
    </nav>
  );
}
