"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { FormModal } from "@/components/Global/Modal";
import { useFetchData } from "@/hooks/useFetchData";
import {
  TujuanOpdPerencanaan,
  TujuanOpdPerencanaanResponse,
  TujuanOpdRealisasi,
  TujuanOpdRealisasiResponse,
  TujuanOpdTargetRealisasiCapaian,
} from "@/types";
import React, { useEffect, useState } from "react";
import FormRealisasiTujuanOpd from "./_components/FormRealisasiTujuanOpd";
import TableTujuanOpd from "./_components/TableTujuanOpd";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataPerencanaanRealisasi";
import { useFilterContext } from "@/context/FilterContext";
import { parsePeriodeRange } from "@/lib/filter";

export default function TujuanPage() {
  const { activeFilter } = useFilterContext();
  const kodeOpd = activeFilter.dinas;
  const selectedTahun = activeFilter.tahun;
  const { tahunAwal, tahunAkhir } = parsePeriodeRange(activeFilter.periode);
  const jenisPeriode = "rpjmd";
  const canFetchPerencanaan =
    Boolean(kodeOpd) &&
    typeof tahunAwal === "number" &&
    typeof tahunAkhir === "number";
  const canFetchRealisasi = Boolean(kodeOpd && selectedTahun);

  const {
    data: tujuanOpdData,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<TujuanOpdPerencanaanResponse>({
    url: canFetchPerencanaan
      ? `/api/perencanaan/tujuan_opd/findall/${kodeOpd}/tahunawal/${tahunAwal}/tahunakhir/${tahunAkhir}/jenisperiode/${jenisPeriode}`
      : null,
  });
  const {
    data: realisasiData,
    loading: realisasiLoading,
    error: realisasiError,
  } = useFetchData<TujuanOpdRealisasiResponse>({
    url: canFetchRealisasi
      ? `/api/realisasi/tujuan_opd/${kodeOpd}/by-tahun/${selectedTahun}`
      : null,
  });
  const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<
    TujuanOpdTargetRealisasiCapaian[]
  >([]);
  const [PerencanaanTujuanOpd, setPerencanaanTujuanOpd] = useState<
    TujuanOpdPerencanaan[]
  >([]);
  const [NamaOpd, setNamaOpd] = useState<string>("");
  const [OpenModal, setOpenModal] = useState<boolean>(false);
  const [TujuanOpdSelected, setTujuanOpdSelected] = useState<
    TujuanOpdTargetRealisasiCapaian[]
  >([]);

  useEffect(() => {
    if (tujuanOpdData?.data && realisasiData) {
      const perencanaan = tujuanOpdData.data;
      setPerencanaanTujuanOpd(perencanaan[0].tujuan_opd);

      setNamaOpd(perencanaan[0].nama_opd);

      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan[0].tujuan_opd,
        realisasiData,
      );
      setTargetRealisasiCapaian(combinedData);
    } else {
      setNamaOpd("");
      setTargetRealisasiCapaian([]);
      setPerencanaanTujuanOpd([]);
    }
  }, [tujuanOpdData, realisasiData]);

  if (perencanaanLoading || realisasiLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (!canFetchPerencanaan || !canFetchRealisasi || !selectedTahun) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih dinas, periode, dan tahun dahulu
      </div>
    );
  }
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realisasiError)
    return <div>Error fetching realisasi: {realisasiError}</div>;

  const handleOpenModal = (
    tujuan: TujuanOpdPerencanaan,
    dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[],
  ) => {
    // tujuan -> buat text diatas sama filter
    const targetCapaian = dataTargetRealisasi.filter(
      (tc) => tc.tujuanId === tujuan.id_tujuan_opd,
    );

    if (targetCapaian) {
      setTujuanOpdSelected(targetCapaian); // Set the selected purpose to the found target capaian
    } else {
      console.warn("No matching target capaian found for the selected tujuan");
      setTujuanOpdSelected([]); // Optionally reset if nothing is found to avoid stale data
    }
    setOpenModal(true);
  };

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">
        Realisasi Tujuan OPD - {NamaOpd} Tahun {selectedTahun}
      </h2>
      <TableTujuanOpd
        tahun={Number(selectedTahun)}
        tujuanOpd={PerencanaanTujuanOpd}
        targetRealisasiCapaians={TargetRealisasiCapaian}
        handleOpenModal={handleOpenModal}
      />
      <FormModal
        isOpen={OpenModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title={`Realisasi Tujuan OPD - ${TujuanOpdSelected[0]?.tujuanOpd || ""}`}
      >
        <FormRealisasiTujuanOpd
          requestValues={TujuanOpdSelected}
          onClose={() => {
            setOpenModal(false);
          }}
          onSuccess={(result: TujuanOpdRealisasi[]) => {
            const updated = gabunganDataPerencanaanRealisasi(
              PerencanaanTujuanOpd,
              result,
            );
            setTargetRealisasiCapaian(updated);
          }}
        />
      </FormModal>
    </div>
  );
}
