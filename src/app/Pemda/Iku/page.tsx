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

const IkuPage = () => {
  const periode = [2025, 2030];
  const tahun = periode[0];
  const {
    data: ikuPerencanaan,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<IkuPemdaPerencanaanResponse>({
    url: `/api/perencanaan/indikator_utama/periode/${periode[0]}/${periode[-1]}/rpjmd`,
  });
  const {
    data: ikuRealisasi,
    loading: realisasiLoading,
    error: realisasiError,
  } = useFetchData<IkuPemdaRealisasiResponse>({
    url: `/api/realisasi/ikus/by-tahun/${tahun}`,
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
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realisasiError)
    return <div>Error fetching realisasi: {realisasiError}</div>;

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">Realisasi IKU Pemda</h2>
      <div className="mt-2 rounded-t-lg border border-red-400">
        <TableIku
          tahun={tahun}
          ikuPemda={PerencanaanIku}
          targetRealisasiCapaian={TargetRealisasiCapaian}
        />
      </div>
    </div>
  );
};

export default IkuPage;
