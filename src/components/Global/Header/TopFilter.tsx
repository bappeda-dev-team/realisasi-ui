"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useBrandingContext } from "@/context/BrandingContext";
import { useFilterContext } from "@/context/FilterContext";
import Select from "react-select";
import Cookies from "js-cookie";
import { ToastSuccess } from "@/components/Global/Alert";
import { User } from "@/types";

interface LabelDropdown {
  value: string;
  label: string;
}

interface SelectedCookie {
  dinas: LabelDropdown | null;
  periode: LabelDropdown | null;
  tahun: LabelDropdown | null;
  bulan: LabelDropdown | null;
}

interface FilterProps {
  user: User | null;
}

export default function TopFilter({ user }: FilterProps) {
  const { branding } = useBrandingContext();
  const {
    dinas,
    periode,
    tahun,
    bulan,
    setDinas,
    setPeriode,
    setTahun,
    setBulan,
  } = useFilterContext();
  const [ShowToast, setShowToast] = useState(false);

  const [dinasOptions, setDinasOptions] = useState<LabelDropdown[]>([]);
  const [periodeOptions, setPeriodeOptions] = useState<LabelDropdown[]>([]);
  const [tahunOptions, setTahunOptions] = useState<LabelDropdown[]>([]);
  const [bulanOptions, setBulanOptions] = useState<LabelDropdown[]>([]);

  // loading dropdown
  const [loadingDinas, setLoadingDinas] = useState<boolean>(false);
  const [loadingPeriode, setLoadingPeriode] = useState<boolean>(false);
  const [loadingTahun, setLoadingTahun] = useState<boolean>(false);

  // ----------------------------
  // FETCH AWAL (DINAS, PERIODE, TAHUN)
  // ----------------------------
  useEffect(() => {
    loadDinas();
    loadPeriode();
    loadTahun();
    loadBulan();
  }, []);

  async function loadDinas() {
    const resp = [
      { value: "dinas1", label: "Dinas Pendidikan" },
      { value: "dinas2", label: "Dinas Kesehatan" },
    ];
    setDinasOptions(resp);
  }

  async function loadPeriode() {
    const resp = [
      { value: "2021-2026", label: "Periode 2021–2026" },
      { value: "2026-2031", label: "Periode 2026–2031" },
    ];
    setPeriodeOptions(resp);
  }

  async function loadTahun() {
    const resp = [2021, 2022, 2023, 2024, 2025].map((y) => ({
      value: y.toString(),
      label: `Tahun ${y}`,
    }));
    setTahunOptions(resp);
  }

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
  useEffect(() => {
    const cookieStr = Cookies.get("selectedCookie");
    if (!cookieStr) return;

    try {
      const cookie: SelectedCookie = JSON.parse(cookieStr);
      setDinas(cookie.dinas?.value ?? null);
      setPeriode(cookie.periode?.value ?? null);
      setTahun(cookie.tahun?.value ?? null);
      setBulan(cookie.bulan?.value ?? null);
    } catch {}
  }, []);

  // ----------------------------
  // SIMPAN COOKIE
  // ----------------------------
  function handleActivate() {
    const cookieValue: SelectedCookie = {
      dinas: dinasOptions.find((x) => x.value === dinas) ?? null,
      periode: periodeOptions.find((x) => x.value === periode) ?? null,
      tahun: tahunOptions.find((x) => x.value === tahun) ?? null,
      bulan: bulanOptions.find((x) => x.value === bulan) ?? null,
    };

    Cookies.set("selectedCookie", JSON.stringify(cookieValue), {
      expires: 30,
    });

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
          <Select
            instanceId="select-dinas"
            className="text-sm w-full sm:w-64"
            options={dinasOptions}
            isLoading={loadingDinas}
            value={dinasOptions.find((x) => x.value === dinas) ?? null}
            onChange={(opt) => setDinas(opt?.value ?? null)}
            placeholder={loadingDinas ? "Memuat..." : "Pilih Dinas/OPD"}
            isSearchable
            isClearable
          />

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
