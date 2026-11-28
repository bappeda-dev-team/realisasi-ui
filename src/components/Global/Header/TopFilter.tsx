"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useBrandingContext } from "@/context/BrandingContext";
import { useFilterContext } from "@/context/FilterContext";
import Select, { StylesConfig } from "react-select";
import Cookies from "js-cookie";
import { ToastSuccess } from "@/components/Global/Alert";
import { User } from "@/types";
import { canAccessPemda, canSelectAllOpdFilters, getUserLevelRole, isIndividuUser } from "@/lib/rbac";
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
  opdLocked?: boolean;
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

interface RoleOptionData {
  label: string;
  value: string;
}

const getSelectStyles = <Option,>(): StylesConfig<Option, false> => ({
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.hasValue ? "#22c55e" : baseStyles.borderColor,
    borderWidth: state.hasValue ? "3px" : baseStyles.borderWidth,
  }),
});

export default function TopFilter({ user, disableOpdLock, forceOpdLock, hideOpd, opdLocked }: FilterProps) {
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
    namaDinas,
    setPeriode,
    setTahun,
    setBulan,
    setActivatedBulan,
    levelRole,
    activatedLevelRole,
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
  const [roleIdByLevel, setRoleIdByLevel] = useState<Record<string, string>>({});

  const [loadingTahun, setLoadingTahun] = useState<boolean>(false);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);

  const isSuperAdmin = user ? canAccessPemda(user) : false;
  const isAdminOpd = user ? user.roles.includes('admin_opd') : false;
  const isAdminOrSuperAdmin = isSuperAdmin || isAdminOpd;
  const canEditOpd = user ? canSelectAllOpdFilters(user) : false;
  const userKodeOpd = user?.kode_opd;

  const userProfileOpd = user?.kode_opd ?? null;
  
  const lockedToUserOpd = Boolean(user && isIndividuUser(user) && userProfileOpd);

  const effectivelyCanEditOpd = opdLocked || lockedToUserOpd
    ? false
    : (forceOpdLock && !canEditOpd) ? false : canEditOpd;

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
    data: dataRoleOptions,
    loading: loadingRoleOptions,
  } = useFetchData<{ data: RoleOptionData[] }>({
    url: `/api/kepegawaian/role/options`,
    trigger: fetchTrigger,
  });

  const selectedRoleId = levelRole ? roleIdByLevel[levelRole] : undefined;

  const {
    data: dataPegawai,
    loading: loadingPegawai,
    error: errorPegawai,
  } = useFetchData<{ data: PegawaiData[] }>({
    url:
      dinas && selectedRoleId && (isSuperAdmin || isAdminOpd)
        ? `/api/kepegawaian/pegawai?kodeOpd=${encodeURIComponent(dinas)}&roleId=${encodeURIComponent(selectedRoleId)}`
        : null,
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

      // Pastikan OPD yang dipilih di popup modal selalu ada di daftar,
      // sehingga dropdown header menampilkan nilai yang sama dengan popup.
      if (dinas && namaDinas && !options.some((opt) => opt.value === dinas)) {
        options = [{ value: dinas, label: namaDinas }, ...options];
      }

      setDinasOptions(options);
    }
  }, [dataDinas, effectivelyCanEditOpd, disableOpdLock, userKodeOpd, dinas, namaDinas]);

  // ----------------------------
  // SEED OPD & LEVEL ROLE DARI USER-INFO
  // ----------------------------
  const seededProfileOpd = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      seededProfileOpd.current = null;
      return;
    }
    if (!userProfileOpd) return;

    const key = `${user.username}:${userProfileOpd}`;
    if (seededProfileOpd.current === key) return;
    seededProfileOpd.current = key;

    setDinas(userProfileOpd);
    setActivatedDinas(userProfileOpd);

    // Level role hanya untuk user individu; admin memilih manual di header.
    if (isIndividuUser(user)) {
      const level = getUserLevelRole(user);
      if (level) {
        setLevelRole(level);
        setActivatedLevelRole(level);
      }
    }
  }, [
    user,
    userProfileOpd,
    setDinas,
    setActivatedDinas,
    setLevelRole,
    setActivatedLevelRole,
  ]);

  // Lengkapi nama OPD setelah daftar OPD termuat (dipakai header & judul tabel).
  useEffect(() => {
    if (!dinas || namaDinas) return;
    const opt = dinasOptions.find((o) => o.value === dinas);
    if (opt) setNamaDinas(opt.label);
  }, [dinas, namaDinas, dinasOptions, setNamaDinas]);

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
  // DROPDOWN LEVEL ROLE
  // ----------------------------
  useEffect(() => {
    if (dataRoleOptions?.data) {
      const nextRoleIdByLevel: Record<string, string> = {};
      const options = dataRoleOptions.data.map((role) => {
        const normalizedLevel = role.label.trim().replace(/\s+/g, "_").toUpperCase();
        nextRoleIdByLevel[normalizedLevel] = role.value;
        return {
          value: normalizedLevel,
          label: role.label,
        };
      });

      setRoleIdByLevel(nextRoleIdByLevel);
      setLevelRoleOptions(options);
    }
  }, [dataRoleOptions]);

  // ----------------------------
  // DROPDOWN PEGAWAI
  // ----------------------------
  useEffect(() => {
    if (!dinas || !selectedRoleId) {
      setNamaPegawaiOptions([]);
      return;
    }
    if (dataPegawai?.data) {
      setNamaPegawaiOptions(
        dataPegawai.data.map((p) => ({
          value: p.nip?.replace(/-$/, ""),
          label: p.nama_pegawai,
        }))
      );
    } else if (!loadingPegawai) {
      setNamaPegawaiOptions([]);
    }
  }, [dataPegawai, dinas, loadingPegawai, selectedRoleId]);

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

    if (tahun && !tahunList.some((option) => option.value === tahun)) {
      setTahun(null);
    }
  }, [periode, periodeOptions, tahun]);

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
  }

  // ----------------------------
  // RESTORE DARI COOKIE
  // ----------------------------
  const restoredCookieFor = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      restoredCookieFor.current = null;
      return;
    }
    if (restoredCookieFor.current === user.username) return;
    restoredCookieFor.current = user.username;

    const cookieStr = Cookies.get("selectedCookie");
    if (!cookieStr) return;

    let cookie: SelectedCookie;
    try {
      cookie = JSON.parse(cookieStr);
    } catch {
      return;
    }

    // User individu: OPD & Level Role bersumber dari user-info
    if (!lockedToUserOpd && cookie.dinas?.value) {
      const adaDiOptions = dinasOptions.some(
        (opt) => opt.value === cookie.dinas?.value,
      );
      // Restore hanya jika nilainya ada di daftar, atau daftar belum termuat.
      if (dinasOptions.length === 0 || adaDiOptions) {
        setDinas(cookie.dinas.value);
        setActivatedDinas(cookie.dinas.value);
        setNamaDinas(cookie.dinas.label ?? null);
      }
    }

    setPeriode(cookie.periode?.value ?? null);
    setTahun(cookie.tahun?.value ?? null);
    setActivatedTahun(cookie.tahun?.value ?? null);
    setBulan(cookie.bulan?.value ?? null);
    setActivatedBulan(cookie.bulan?.value ?? null);
    if (!lockedToUserOpd) {
      setLevelRole(cookie.levelRole?.value ?? null);
      setActivatedLevelRole(cookie.levelRole?.value ?? null);
    }
    setNamaPegawai(cookie.namaPegawai?.value ?? null);
    setActivatedNamaPegawai(cookie.namaPegawai?.value ?? null);
  }, [
    periodeOptions,
    dinasOptions,
    user,
    lockedToUserOpd,
    forceOpdLock,
    userKodeOpd,
    isSuperAdmin,
    isAdminOpd,
    setDinas,
    setActivatedDinas,
    setNamaDinas,
    setPeriode,
    setTahun,
    setActivatedTahun,
    setBulan,
    setActivatedBulan,
    setLevelRole,
    setActivatedLevelRole,
    setNamaPegawai,
    setActivatedNamaPegawai,
  ]);

  // ----------------------------
  // AUTO SELECT OPD FOR NON-EDIT USERS (LEVEL 1-4)
  // ----------------------------
  useEffect(() => {
    if (!dinas && !effectivelyCanEditOpd && !disableOpdLock && userKodeOpd && dinasOptions.length > 0) {
      const userOpd = dinasOptions.find((opt) => opt.value === userKodeOpd);
      if (userOpd) {
        setDinas(userOpd.value);
        setActivatedDinas(userOpd.value);
        setNamaDinas(userOpd.label);
      }
    }
  }, [dinas, dinasOptions, effectivelyCanEditOpd, disableOpdLock, userKodeOpd]);

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
              styles={getSelectStyles<LabelDropdown>()}
              options={dinasOptions}
              isLoading={loadingDinas}
              value={dinasOptions.find((x) => x.value === dinas) ?? null}
              onChange={(opt) => {
                setDinas(opt?.value ?? null);
                setNamaPegawai(null);
                setActivatedNamaPegawai(null);
              }}
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
            styles={getSelectStyles<PeriodeDropdown>()}
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
            styles={getSelectStyles<LabelDropdown>()}
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
            styles={getSelectStyles<LabelDropdown>()}
            options={bulanOptions}
            value={bulanOptions.find((x) => x.value === bulan) ?? null}
            onChange={(opt) => setBulan(opt?.value ?? null)}
            placeholder="Bulan"
            isSearchable
            isClearable
          />

          {forceOpdLock && user && (
            <>
              {/* PILIH LEVEL ROLE (semua user bisa memilih level 1-4) */}
              <Select
                instanceId="select-level-role"
                className="text-sm w-full sm:w-44"
                styles={getSelectStyles<LabelDropdown>()}
                options={levelRoleOptions}
                isLoading={loadingRoleOptions}
                value={levelRoleOptions.find((x) => x.value === levelRole) ?? null}
                onChange={(opt) => {
                  setLevelRole(opt?.value ?? null);
                  setNamaPegawai(null);
                  setActivatedNamaPegawai(null);
                }}
                placeholder={loadingRoleOptions ? "Memuat..." : "Level Role"}
                isSearchable
                isClearable={!activatedLevelRole || isAdminOrSuperAdmin}
                isDisabled={Boolean(activatedLevelRole) && !isAdminOrSuperAdmin}
              />

              {/* PILIH NAMA PEGAWAI (khusus super_admin / admin_opd) */}
              {(isSuperAdmin || isAdminOpd) && (
                <Select
                  instanceId="select-nama-pegawai"
                  className="text-sm w-full sm:w-44"
                  styles={getSelectStyles<LabelDropdown>()}
                  options={namaPegawaiOptions}
                  isLoading={loadingPegawai}
                  value={namaPegawaiOptions.find((x) => x.value === namaPegawai) ?? null}
                  onChange={(opt) => setNamaPegawai(opt?.value ?? null)}
                  placeholder={loadingPegawai ? "Memuat..." : "Nama Pegawai"}
                  isSearchable
                  isClearable
                />
              )}
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
