"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useBrandingContext } from "@/context/BrandingContext";
import { useFilterContext } from "@/context/FilterContext";
import Select from "react-select";
import Cookies from "js-cookie";
import { ToastSuccess } from "@/components/Global/Alert";
import { User } from "@/types";
import { useFetchData } from "@/hooks/useFetchData";

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
}

interface FilterProps {
  user: User | null;
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
  const [periodeOptions, setPeriodeOptions] = useState<PeriodeDropdown[]>([]);
  const [tahunOptions, setTahunOptions] = useState<LabelDropdown[]>([]);
  const [bulanOptions, setBulanOptions] = useState<LabelDropdown[]>([]);

  const [loadingTahun, setLoadingTahun] = useState<boolean>(false);

  const {
    data: dataDinas,
    loading: loadingDinas,
    error: errorDinas,
  } = useFetchData<DinasResponse>({
    url: `/api/periode/list_opd`,
  });

  const {
    data: dataPeriode,
    loading: loadingPeriode,
    error: errorPeriode,
  } = useFetchData<PeriodeResponse>({
    url: `/api/periode/periode`,
  });
  // ----------------------------
  // FETCH AWAL (DINAS, PERIODE, TAHUN)
  // ----------------------------
  useEffect(() => {
    loadBulan();
  }, []);

  // ----------------------------
  // DROPDOWN DINAS (OPD)
  // ----------------------------
  useEffect(() => {
    if (dataDinas?.data) {
      setDinasOptions(
        dataDinas.data.map((d) => ({
          value: d.kode_opd,
          label: d.nama_opd,
        })),
      );
    }
  }, [dataDinas]);

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
  }, [periodeOptions]);

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
