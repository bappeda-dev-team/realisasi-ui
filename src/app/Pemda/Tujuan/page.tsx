'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { useFetchData } from '@/hooks/useFetchData';
import { PerencanaanTujuanPemdaResponse, PerencanaanTujuanPemda, RealisasiTujuanResponse, TargetRealisasiCapaian, TujuanPemda, RealisasiTujuan } from '@/types';
import React, { useEffect, useState } from 'react';
import TableTujuan from './_components/TableTujuan';
import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataPerencanaanRealisasi';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { ModalTujuanPemda } from "./_components/ModalTujuan";


export default function Tujuan() {
  const { url, token } = useApiUrlContext();
  const { data: perencanaanData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<PerencanaanTujuanPemdaResponse>({ url: `${url}/api/v1/perencanaan/tujuan_pemda/findall_with_pokin/2025/2030/rpjmd`, token });
  const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<RealisasiTujuanResponse>({ url: `${url}/api/v1/realisasi/tujuans/by-periode/2025/2030/rpjmd`, token });
  const [dataTargetRealisasi, setDataTargetRealisasi] = useState<TargetRealisasiCapaian[]>([]);
  const [tujuansPemda, setTujuansPemda] = useState<TujuanPemda[]>([])
  const [OpenModal, setOpenModal] = useState<boolean>(false);
  const [selectedTujuan, setSelectedTujuan] = useState<TargetRealisasiCapaian[]>([]);
  const [perencanaanTujuan, setPerencanaanTujuan] = useState<PerencanaanTujuanPemda[]>([]);

  const periode = [2025, 2026, 2027, 2028, 2029, 2030];

  useEffect(() => {
    if (perencanaanData && realisasiData) {
      const perencanaan = perencanaanData.data
      setPerencanaanTujuan(perencanaan)

      const combinedData = gabunganDataPerencanaanRealisasi(perencanaan, realisasiData);
      const tujuans = perencanaanData.data.flatMap((pokin) => pokin.tujuan_pemda);
      setDataTargetRealisasi(combinedData);
      setTujuansPemda(tujuans);
    }
  }, [perencanaanData, realisasiData])


  if (perencanaanLoading || realisasiLoading) return <LoadingBeat loading={perencanaanLoading} />;
  if (perencanaanError) return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realisasiError) return <div>Error fetching realisasi: {realisasiError}</div>;

  const handleOpenModal = (tujuan: TujuanPemda, data: TargetRealisasiCapaian[]) => { // tujuan -> buat text diatas sama filter
    const targetCapaian = data.filter(tc => tc.tujuanId === tujuan.id.toString())

    if (targetCapaian) {
      setSelectedTujuan(targetCapaian); // Set the selected purpose to the found target capaian
    } else {
      console.warn('No matching target capaian found for the selected tujuan');
      setSelectedTujuan([]); // Optionally reset if nothing is found to avoid stale data
    }
    setOpenModal(true);
  };


  return (
    <div className="overflow-auto mt-2 rounded-t-lg border border-red-400">
      <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan Pemda</h2>
      <TableTujuan
        periode={periode}
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
          const updated = gabunganDataPerencanaanRealisasi(perencanaanTujuan, result)
          setDataTargetRealisasi(updated)
        }}
      />
    </div>
  )
}
