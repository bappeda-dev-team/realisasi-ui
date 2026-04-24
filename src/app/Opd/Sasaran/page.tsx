"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { FormModal } from "@/components/Global/Modal";
import React, { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilterContext } from "@/context/FilterContext";
import { getMonthName } from "@/lib/months";
import {
  SasaranOpdPerencanaanResponse,
  SasaranOpdPerencanaan,
  SasaranOpdRealisasiResponse,
  SasaranOpdTargetRealisasiCapaian,
} from "@/types";
import TableSasaranOpd from "./_components/TableSasaranOpd";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataPerencanaanRealisasi";
import FormRealisasiSasaranOpd from "./_components/FormRealisasiSasaranOpd";

export default function SasaranPage() {
  const { activatedDinas: kodeOpd, activatedTahun: selectedTahun, activatedBulan, bulan, namaDinas: namaOpd } = useFilterContext();
  const selectedTahunValue = selectedTahun ? parseInt(selectedTahun) : 2025;
  const bulanName = getMonthName(activatedBulan) ?? getMonthName(bulan ?? null) ?? "Bulan";
  const periode = [2025, 2026, 2027, 2028, 2029, 2030];
  const tahunAwal = periode[0];
  const tahunAkhir = periode[periode.length - 1];
  const jenisPeriode = "rpjmd";
  const {
    data: sasaranOpdData,
    loading: perencanaanLoading,
    error: perencanaanError,
} = useFetchData<SasaranOpdPerencanaanResponse>({
    url: kodeOpd ? `/api/perencanaan/sasaran_opd/renja/${kodeOpd}/${selectedTahunValue}/${jenisPeriode}` : null,
  });
const {
    data: realizationData,
    loading: realizationLoading,
    error: realizationError,
    refetch: refetchRealization,
  } = useFetchData<SasaranOpdRealisasiResponse>({
    url: kodeOpd && selectedTahunValue && bulanName ? `/api/v1/realisasi/sasaran_opd/${kodeOpd}/by-tahun/${selectedTahunValue}/bulan/${encodeURIComponent(bulanName)}` : null,
  });
  const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<
    SasaranOpdTargetRealisasiCapaian[]
  >([]);
  const [PerencanaanSasaranOpd, setPerencanaanSasaranOpd] = useState<
    SasaranOpdPerencanaan[]
  >([]);
  const [SasaranOpdSelected, setSasaranOpdSelected] = useState<
    SasaranOpdTargetRealisasiCapaian[]
  >([]);
  const [OpenModal, setOpenModal] = useState<boolean>(false);

useEffect(() => {
    if (sasaranOpdData?.data && realizationData && kodeOpd) {
      const perencanaan = sasaranOpdData.data
        .flatMap(pohon => pohon.sasaran_opd);
      setPerencanaanSasaranOpd(perencanaan);

      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan,
        realizationData,
        kodeOpd,
      );
      setTargetRealisasiCapaian(combinedData);
    } else {
      setTargetRealisasiCapaian([]);
      setPerencanaanSasaranOpd([]);
    }
  }, [sasaranOpdData, realizationData, kodeOpd]);

  if (perencanaanLoading || realizationLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realizationError)
    return <div>Error fetching realization: {realizationError}</div>;

  const handleOpenModal = (
    sasaran: SasaranOpdPerencanaan,
    dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[],
    indikatorId: string,
  ) => {
    const targetCapaian = dataTargetRealisasi.filter(
      (tc) => tc.sasaranId === sasaran.id.toString() && tc.indikatorId === indikatorId,
    );

    if (targetCapaian.length > 0) {
      setSasaranOpdSelected(targetCapaian);
    } else {
      console.warn("No matching target capaian found for the selected tujuan");
      setSasaranOpdSelected([]);
    }
    setOpenModal(true);
  };

  if (!kodeOpd || !selectedTahun || !bulanName) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih OPD, tahun, dan bulan dahulu
      </div>
    );
  }

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">
        Realisasi Sasaran OPD - {namaOpd || '-'} {selectedTahunValue} - {bulanName}
      </h2>
      <TableSasaranOpd
        tahun={selectedTahunValue}
        bulanLabel={bulanName}
        sasaranOpd={PerencanaanSasaranOpd}
        targetRealisasiCapaians={TargetRealisasiCapaian}
        handleOpenModal={handleOpenModal}
      />
      <FormModal
        isOpen={OpenModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title={`Realisasi Sasaran OPD - ${namaOpd || '-'} ${selectedTahunValue} - ${bulanName}`}
      >
        <FormRealisasiSasaranOpd
          requestValues={SasaranOpdSelected}
          tahun={selectedTahunValue}
          bulanLabel={bulanName}
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
