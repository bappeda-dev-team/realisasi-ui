"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { FormModal } from "@/components/Global/Modal";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilterContext } from "@/context/FilterContext";
import {
  TujuanOpdPerencanaan,
  TujuanOpdPerencanaanResponse,
  TujuanOpdRealisasiResponse,
  TujuanOpdTargetRealisasiCapaian,
} from "@/types";
import React, { useEffect, useState } from "react";
import FormRealisasiTujuanOpd from "./_components/FormRealisasiTujuanOpd";
import TableTujuanOpd from "./_components/TableTujuanOpd";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataPerencanaanRealisasi";

export default function TujuanPage() {
  const { activatedDinas: kodeOpd, activatedTahun: selectedTahun } = useFilterContext();
  const selectedTahunValue = selectedTahun ? parseInt(selectedTahun) : 2025;
  const periode = [2025, 2026, 2027, 2028, 2029, 2030];
  const tahunAwal = periode[0];
  const tahunAkhir = periode[periode.length - 1];
  const jenisPeriode = "rpjmd";
  const {
    data: tujuanOpdData,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<TujuanOpdPerencanaanResponse>({
    url: kodeOpd ? `/api/perencanaan/tujuan_opd/findall/${kodeOpd}/tahunawal/${tahunAwal}/tahunakhir/${tahunAkhir}/jenisperiode/${jenisPeriode}` : null,
  });
const {
    data: realizationData,
    loading: realizationLoading,
    error: realizationError,
    refetch: refetchRealization,
  } = useFetchData<TujuanOpdRealisasiResponse>({
    url: kodeOpd ? `/api/realisasi/tujuan_opd/${kodeOpd}/by-tahun/${selectedTahunValue}` : null,
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
    if (tujuanOpdData?.data && realizationData && kodeOpd) {
      const perencanaan = tujuanOpdData.data;
      setPerencanaanTujuanOpd(perencanaan[0].tujuan_opd);

      setNamaOpd(perencanaan[0].nama_opd);

      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan[0].tujuan_opd,
        realizationData,
        kodeOpd,
      );
      setTargetRealisasiCapaian(combinedData);
    } else {
      setNamaOpd("");
      setTargetRealisasiCapaian([]);
      setPerencanaanTujuanOpd([]);
    }
  }, [tujuanOpdData, realizationData, kodeOpd]);

  if (perencanaanLoading || realizationLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realizationError)
    return <div>Error fetching realistasi: {realizationError}</div>;

  if (!kodeOpd || !selectedTahun) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih periode dan tahun dahulu
      </div>
    );
  }

  const handleOpenModal = (
    tujuan: TujuanOpdPerencanaan,
    dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[],
  ) => {
    setTujuanOpdSelected(dataTargetRealisasi);
    setOpenModal(true);
  };

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">
        Realisasi Tujuan OPD - {NamaOpd} Tahun {selectedTahunValue}
      </h2>
      <TableTujuanOpd
        tahun={selectedTahunValue}
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
          tahun={selectedTahunValue}
          onClose={() => {
            setOpenModal(false);
          }}
          onSuccess={() => {
            setOpenModal(false);
            refetchRealization();
          }}
        />
      </FormModal>
    </div>
  );
}
