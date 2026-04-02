"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { useFetchData } from "@/hooks/useFetchData";
import React, { useEffect, useState } from "react";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataSasaranRealisasi";
import TableIku from "./_components/TableIku";
import {
  IkuPemdaPerencanaanResponse,
  IkuPemdaRealisasiResponse,
  IkuPemda,
  IkuPemdaTargetRealisasiCapaian,
} from "@/types";
import { useFilterContext } from "@/context/FilterContext";
import { parsePeriodeRange } from "@/lib/filter";

const IkuPage = () => {
  const { activeFilter } = useFilterContext();
  const { tahunAwal, tahunAkhir } = parsePeriodeRange(activeFilter.periode);
  const jenisPeriode = "rpjmd";
  const selectedTahun = activeFilter.tahun;
  const canFetchPerencanaan =
    typeof tahunAwal === "number" && typeof tahunAkhir === "number";
  const canFetchRealisasi = Boolean(selectedTahun);

  const {
    data: ikuPerencanaan,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<IkuPemdaPerencanaanResponse>({
    url: canFetchPerencanaan
      ? `/api/perencanaan/indikator_utama/periode/${tahunAwal}/${tahunAkhir}/${jenisPeriode}`
      : null,
  });
  const {
    data: ikuRealisasi,
    loading: realisasiLoading,
    error: realisasiError,
  } = useFetchData<IkuPemdaRealisasiResponse>({
    url: canFetchRealisasi
      ? `/api/realisasi/ikus/by-tahun/${selectedTahun}`
      : null,
  });
  const [PerencanaanIku, setPerencanaanIku] = useState<IkuPemda[]>([]);
  const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<
    IkuPemdaTargetRealisasiCapaian[]
  >([]);

  useEffect(() => {
    if (ikuPerencanaan?.data && ikuRealisasi) {
      const perencanaan = ikuPerencanaan.data;
      setPerencanaanIku(perencanaan);

      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan,
        ikuRealisasi,
      );
      setTargetRealisasiCapaian(combinedData);
    }
  }, [ikuPerencanaan, ikuRealisasi]);

  if (perencanaanLoading || realisasiLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (!selectedTahun || !canFetchPerencanaan) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih periode dan tahun dahulu
      </div>
    );
  }
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realisasiError)
    return <div>Error fetching realisasi: {realisasiError}</div>;

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">Realisasi IKU Pemda</h2>
      <div className="mt-2 rounded-t-lg border border-red-400">
        <TableIku
          tahun={Number(selectedTahun)}
          ikuPemda={PerencanaanIku}
          targetRealisasiCapaian={TargetRealisasiCapaian}
        />
      </div>
    </div>
  );
};

export default IkuPage;
