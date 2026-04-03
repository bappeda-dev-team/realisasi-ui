"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { FormModal } from "@/components/Global/Modal";
import React, { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import {
  SasaranOpdPerencanaanResponse,
  SasaranOpdPerencanaan,
  SasaranOpdRealisasiResponse,
  SasaranOpdTargetRealisasiCapaian,
  SasaranOpdRealisasi,
} from "@/types";
import TableSasaranOpd from "./_components/TableSasaranOpd";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataPerencanaanRealisasi";
import FormRealisasiSasaranOpd from "./_components/FormRealisasiSasaranOpd";
import { useFilterContext } from "@/context/FilterContext";

interface DinasResponse {
  code: number;
  status: string;
  data: ListDinas[];
}

interface ListDinas {
  kode_opd: string;
  nama_opd: string;
}

export default function SasaranPage() {
  const { activeFilter } = useFilterContext();
  const kodeOpd = activeFilter.dinas;
  const selectedTahun = activeFilter.tahun;
  const jenisPeriode = "rpjmd";
  const canFetch = Boolean(kodeOpd && selectedTahun);

  // Ambil nama OPD dari endpoint periode (dipakai juga oleh TopFilter)
  const { data: dinasData } = useFetchData<DinasResponse>({
    url: kodeOpd ? "/api/periode/list_opd" : null,
    requireSession: false,
  });

  const {
    data: sasaranOpdData,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<SasaranOpdPerencanaanResponse>({
    url: canFetch
      ? `/api/perencanaan/sasaran_opd/renja/${kodeOpd}/${selectedTahun}/${jenisPeriode}`
      : null,
  });
  const {
    data: realisasiData,
    loading: realisasiLoading,
    error: realisasiError,
  } = useFetchData<SasaranOpdRealisasiResponse>({
    url: canFetch
      ? `/api/realisasi/sasaran_opd/${kodeOpd}/by-tahun/${selectedTahun}`
      : null,
  });
  const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<
    SasaranOpdTargetRealisasiCapaian[]
  >([]);
  const [PerencanaanSasaranOpd, setPerencanaanSasaranOpd] = useState<
    SasaranOpdPerencanaan[]
  >([]);
  const [NamaOpd, setNamaOpd] = useState<string>("");
  const [SasaranOpdSelected, setSasaranOpdSelected] = useState<
    SasaranOpdTargetRealisasiCapaian[]
  >([]);
  const [OpenModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    if (!kodeOpd || !dinasData?.data) {
      setNamaOpd("");
      return;
    }

    const found = dinasData.data.find((d) => d.kode_opd === kodeOpd);
    setNamaOpd(found?.nama_opd ?? "");
  }, [kodeOpd, dinasData]);

  useEffect(() => {
    if (sasaranOpdData?.data && realisasiData) {
      const perencanaan = sasaranOpdData.data
        .flatMap(pohon => pohon.sasaran_opd);
      setPerencanaanSasaranOpd(perencanaan);
      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan,
        realisasiData,
      );
      setTargetRealisasiCapaian(combinedData);
    } else {
      setTargetRealisasiCapaian([]);
      setPerencanaanSasaranOpd([]);
    }
  }, [sasaranOpdData, realisasiData]);

  if (perencanaanLoading || realisasiLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (!canFetch || !selectedTahun) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih dinas dan tahun dahulu
      </div>
    );
  }
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realisasiError)
    return <div>Error fetching realisasi: {realisasiError}</div>;

  const handleOpenModal = (
    sasaran: SasaranOpdPerencanaan,
    dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[],
  ) => {
    // sasaran -> buat text diatas sama filter
    const targetCapaian = dataTargetRealisasi.filter(
      (tc) => tc.sasaranId === sasaran.id.toString(),
    );

    if (targetCapaian) {
      setSasaranOpdSelected(targetCapaian); // Set the selected purpose to the found target capaian
    } else {
      console.warn("No matching target capaian found for the selected tujuan");
      setSasaranOpdSelected([]); // Optionally reset if nothing is found to avoid stale data
    }
    setOpenModal(true);
  };

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">
        Realisasi Sasaran OPD{NamaOpd ? ` - ${NamaOpd}` : ""} Tahun {selectedTahun}
      </h2>
      <TableSasaranOpd
        tahun={Number(selectedTahun)}
        sasaranOpd={PerencanaanSasaranOpd}
        targetRealisasiCapaians={TargetRealisasiCapaian}
        handleOpenModal={handleOpenModal}
      />
      <FormModal
        isOpen={OpenModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title={`Realisasi Sasaran OPD - ${SasaranOpdSelected[0]?.sasaranOpd || ""}`}
      >
        <FormRealisasiSasaranOpd
          requestValues={SasaranOpdSelected}
          onClose={() => {
            setOpenModal(false);
          }}
          onSuccess={(result: SasaranOpdRealisasi[]) => {
            const updated = gabunganDataPerencanaanRealisasi(
              PerencanaanSasaranOpd,
              result,
            );
            setTargetRealisasiCapaian(updated);
          }}
        />
      </FormModal>
    </div>
  );
}
