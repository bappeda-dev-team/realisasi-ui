"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { useFetchData } from "@/hooks/useFetchData";
import React, { useEffect, useState } from "react";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataSasaranRealisasi";
import {
  PerencanaanSasaranPemdaResponse,
  RealisasiSasaran,
  RealisasiSasaranResponse,
  SasaranPemda,
  TargetRealisasiCapaianSasaran,
} from "@/types";
import TableSasaran from "./_components/TableSasaran";
import { FormModal } from "@/components/Global/Modal";
import FormRealisasiSasaranPemda from "./_components/FormRealisasiSasaranPemda";

const SasaranPage = () => {
  const periode = [2025, 2030];
  const tahun = periode[0];
  const {
    data: sasaranData,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<PerencanaanSasaranPemdaResponse>({
    url: `/api/perencanaan/sasaran_pemda/findall/tahun_awal/${periode[0]}/tahun_akhir/${periode[1]}/jenis_periode/rpjmd`,
  });
  const {
    data: realisasiData,
    loading: realisasiLoading,
    error: realisasiError,
  } = useFetchData<RealisasiSasaranResponse>({
    url: `/api/realisasi/sasarans/by-tahun/${periode[0]}`,
  });
  const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<
    TargetRealisasiCapaianSasaran[]
  >([]);
  const [PerencanaanSasaran, setPerencanaanSasaran] = useState<SasaranPemda[]>(
    [],
  );
  const [OpenModal, setOpenModal] = useState<boolean>(false);
  const [SelectedSasaran, setSelectedSasaran] = useState<
    TargetRealisasiCapaianSasaran[]
  >([]);

  useEffect(() => {
    if (sasaranData?.data && realisasiData) {
      const perencanaan: SasaranPemda[] = sasaranData.data
        .flatMap((tema) => tema.subtematik)
        .flatMap((subTema) => subTema.sasaran_pemda);

      setPerencanaanSasaran(perencanaan);

      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan,
        realisasiData,
      );
      setTargetRealisasiCapaian(combinedData);
    }
  }, [sasaranData, realisasiData]);

  if (perencanaanLoading || realisasiLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realisasiError)
    return <div>Error fetching realisasi: {realisasiError}</div>;

  // modal logic
  const handleOpenModal = (
    sasaran: SasaranPemda,
    dataTargetRealisasi: TargetRealisasiCapaianSasaran[],
  ) => {
    // sasaran -> buat text diatas sama filter
    const targetCapaian = dataTargetRealisasi.filter(
      (tc) => tc.sasaranId === sasaran.id.toString(),
    );

    if (targetCapaian) {
      setSelectedSasaran(targetCapaian);
    } else {
      setSelectedSasaran([]);
    }
    setOpenModal(true);
  };

  return (
    <div className="overflow-auto grid gap-2">
      <h2 className="text-lg font-semibold mb-2">Realisasi Sasaran Pemda</h2>
      <div className="mt-2 rounded-t-lg border border-red-400">
        <TableSasaran
          tahun={tahun}
          sasaranPemda={PerencanaanSasaran}
          targetRealisasiCapaian={TargetRealisasiCapaian}
          handleOpenModal={handleOpenModal}
        />
        <FormModal
          isOpen={OpenModal}
          onClose={() => {
            setOpenModal(false);
          }}
          title={`Realisasi Sasaran Pemda - ${SelectedSasaran[0]?.sasaranPemda ?? ""}`}
        >
          <FormRealisasiSasaranPemda
            requestValues={SelectedSasaran}
            onClose={() => {
              setOpenModal(false);
            }}
            onSuccess={(result: RealisasiSasaran[]) => {
              const updated = gabunganDataPerencanaanRealisasi(
                PerencanaanSasaran,
                result,
              );
              setTargetRealisasiCapaian(updated);
            }}
          />
        </FormModal>
      </div>
    </div>
  );
};

export default SasaranPage;
