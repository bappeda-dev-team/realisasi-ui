"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useBrandingContext } from "@/context/BrandingContext";
import { useFilterContext } from "@/context/FilterContext";
import Select from "react-select";
import { ToastError, ToastSuccess } from "@/components/Global/Alert";
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

const TAHUN_MIN = 2020;
const TAHUN_MAX = 2040;

export default function TopFilter({ user }: FilterProps) {
  const { branding } = useBrandingContext();
  const {
    draftFilter,
    setDraftDinas,
    setDraftPeriode,
    setDraftTahun,
    setDraftBulan,
    hasRequiredDraft,
    activateFilter,
  } = useFilterContext();
  const [ShowToast, setShowToast] = useState(false);
  const [ShowToastError, setShowToastError] = useState(false);

  const [dinasOptions, setDinasOptions] = useState<LabelDropdown[]>([]);
  const [periodeOptions, setPeriodeOptions] = useState<PeriodeDropdown[]>([]);
  const [tahunOptions, setTahunOptions] = useState<LabelDropdown[]>([]);
  const [bulanOptions, setBulanOptions] = useState<LabelDropdown[]>([]);

  const opdUrl = user ? "/api/periode/list_opd" : null;

  const {
    data: dataDinas,
    loading: loadingDinas,
  } = useFetchData<DinasResponse>({
    url: opdUrl,
    requireSession: false,
  });

  const periodeUrl = user ? "/api/periode/periode" : null;

  const {
    data: dataPeriode,
    loading: loadingPeriode,
  } = useFetchData<PeriodeResponse>({
    url: periodeUrl,
    requireSession: false,
  });
  // ----------------------------
  // FETCH AWAL (DINAS, PERIODE, TAHUN)
  // ----------------------------
  useEffect(() => {
    loadBulan();

    const tahunList: LabelDropdown[] = [];
    for (let t = TAHUN_MIN; t <= TAHUN_MAX; t++) {
      tahunList.push({
        value: t.toString(),
        label: `Tahun ${t}`,
      });
    }
    setTahunOptions(tahunList);
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

  const tahunOptionsByPeriode = useMemo(() => {
    if (!draftFilter.periode) return [];

    const selected = periodeOptions.find((p) => p.value === draftFilter.periode);
    if (!selected) return [];

    const options: LabelDropdown[] = [];
    for (let y = selected.tahun_awal; y <= selected.tahun_akhir; y++) {
      options.push({
        value: y.toString(),
        label: `Tahun ${y}`,
      });
    }

    return options;
  }, [draftFilter.periode, periodeOptions]);

  function handleActivate() {
    const activated = activateFilter();
    if (!activated) {
      setShowToastError(true);
      return;
    }

    setShowToast(true);
  }

  return (
    <nav className="bg-white shadow-sm px-6 py-3 flex items-center justify-between text-sm">
      <ToastSuccess
        isOpen={ShowToast}
        onClose={() => setShowToast(false)}
        message="Filter diaktifkan"
      />
      <ToastError
        isOpen={ShowToastError}
        onClose={() => setShowToastError(false)}
        message="Dinas, periode, tahun, dan bulan wajib dipilih."
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
            value={dinasOptions.find((x) => x.value === draftFilter.dinas) ?? null}
            onChange={(opt) => setDraftDinas(opt?.value ?? null)}
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
            value={
              periodeOptions.find((x) => x.value === draftFilter.periode) ?? null
            }
            onChange={(opt) => setDraftPeriode(opt?.value ?? null)}
            placeholder={loadingPeriode ? "Memuat..." : "Pilih Periode"}
            isSearchable
            isClearable
          />

          {/* PILIH TAHUN */}
          <Select
            instanceId="select-tahun"
            className="text-sm w-full sm:w-44"
            options={tahunOptionsByPeriode.length > 0 ? tahunOptionsByPeriode : tahunOptions}
            isLoading={false}
            value={
              (tahunOptionsByPeriode.length > 0 ? tahunOptionsByPeriode : tahunOptions).find(
                (x) => x.value === draftFilter.tahun,
              ) ?? null
            }
            onChange={(opt) => setDraftTahun(opt?.value ?? null)}
            placeholder="Pilih Tahun"
            isSearchable
            isClearable
          />

          {/* PILIH BULAN */}
          <Select
            instanceId="select-bulan"
            className="text-sm w-full sm:w-44"
            options={bulanOptions}
            value={bulanOptions.find((x) => x.value === draftFilter.bulan) ?? null}
            onChange={(opt) => setDraftBulan(opt?.value ?? null)}
            placeholder="Bulan"
            isSearchable
            isClearable
          />

          <button
            className={`px-4 py-2.5 rounded-md text-sm font-semibold transition ${hasRequiredDraft ? "bg-gray-700 text-white cursor-pointer hover:bg-blue-700" : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            onClick={handleActivate}
            disabled={!hasRequiredDraft}
          >
            Aktifkan
          </button>
        </div>
      )}
    </nav>
  );
}
