"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { useFetchData } from "@/hooks/useFetchData";
import {
  PerencanaanTujuanPemda,
  PerencanaanTujuanPemdaResponse,
  RealisasiTujuan,
  RealisasiTujuanResponse,
  TargetRealisasiCapaian,
  TujuanPemda,
} from "@/types";
import React, { useEffect, useState } from "react";
import { ModalTujuanPemda } from "./_components/ModalTujuan";
import TableTujuan from "./_components/TableTujuan";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataPerencanaanRealisasi";
import { useFilterContext } from "@/context/FilterContext";

export default function Tujuan() {
  const { periode: selectedPeriode, tahun: selectedTahun } = useFilterContext();

  const years: number[] = [];
  if (selectedPeriode) {
    const [awalStr, akhirStr] = selectedPeriode.split("-").map((t) => t.trim());
    const awal = parseInt(awalStr);
    const akhir = parseInt(akhirStr);

    for (let y = awal; y <= akhir; y++) {
      years.push(y);
    }
  }

  const periode = years;
  const tahunAwal = periode[0];
  const tahunAkhir = periode[periode.length - 1];
  const jenisPeriode = "rpjmd";
  const {
    data: perencanaanData,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<PerencanaanTujuanPemdaResponse>({
    url: `/api/perencanaan/tujuan_pemda/findall_with_pokin/${tahunAwal}/${tahunAkhir}/${jenisPeriode}`,
  });
  const {
    data: realisasiData,
    loading: realisasiLoading,
    error: realisasiError,
  } = useFetchData<RealisasiTujuanResponse>({
    url: `/api/realisasi/tujuans/by-tahun/${selectedTahun}`,
  });
  const [dataTargetRealisasi, setDataTargetRealisasi] = useState<
    TargetRealisasiCapaian[]
  >([]);
  const [tujuansPemda, setTujuansPemda] = useState<TujuanPemda[]>([]);
  const [OpenModal, setOpenModal] = useState<boolean>(false);
  const [selectedTujuan, setSelectedTujuan] = useState<
    TargetRealisasiCapaian[]
  >([]);
  const [perencanaanTujuan, setPerencanaanTujuan] = useState<
    PerencanaanTujuanPemda[]
  >([]);

  useEffect(() => {
    if (selectedTahun === null || periode.length === 0) return;
    if (perencanaanData?.data && realisasiData) {
      const perencanaan = perencanaanData.data;
      setPerencanaanTujuan(perencanaan);

      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan,
        realisasiData,
      );

      const tujuans: TujuanPemda[] = perencanaanData.data.flatMap(
        (pokin) => pokin.tujuan_pemda,
      );

      setDataTargetRealisasi(combinedData);
      setTujuansPemda(tujuans);
    }
  }, [selectedTahun]);

  if (selectedTahun === null || periode.length === 0)
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih periode dan tahun dahulu
      </div>
    );
  /* if (!perencanaanData || !realisasiData) return <LoadingBeat loading={perencanaanLoading} />; */
  if (perencanaanLoading || realisasiLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realisasiError)
    return <div>Error fetching realisasi: {realisasiError}</div>;

  const handleOpenModal = (
    tujuan: TujuanPemda,
    data: TargetRealisasiCapaian[],
  ) => {
    // tujuan -> buat text diatas sama filter
    const targetCapaian = data.filter(
      (tc) => tc.tujuanId === tujuan.id.toString(),
    );

    if (targetCapaian) {
      setSelectedTujuan(targetCapaian); // Set the selected purpose to the found target capaian
    } else {
      console.warn("No matching target capaian found for the selected tujuan");
      setSelectedTujuan([]); // Optionally reset if nothing is found to avoid stale data
    }
    setOpenModal(true);
  };

  // here's the magic
  // filter the fkin periode
  const periodeTampil = years.filter((p) => p === parseInt(selectedTahun));

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan Pemda</h2>
      <div className="mt-2 rounded-t-lg border border-red-400">
        <TableTujuan
          periode={periodeTampil}
          tujuansPemda={tujuansPemda}
          targetRealisasiCapaians={dataTargetRealisasi}
          handleOpenModal={handleOpenModal}
        />
        <ModalTujuanPemda
          item={selectedTujuan}
          isOpen={OpenModal}
          onClose={() => {
            setOpenModal(false);
          }}
          onSuccess={(result: RealisasiTujuan[]) => {
            const updated = gabunganDataPerencanaanRealisasi(
              perencanaanTujuan,
              result,
            );
            setDataTargetRealisasi(updated);
          }}
        />
      </div>
    </div>
  );
}
