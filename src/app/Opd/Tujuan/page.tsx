'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { useFetchData } from '@/hooks/useFetchData';
import { TujuanOpd, TujuanOpdPerencanaanResponse, TujuanOpdRealisasiResponse, TujuanOpdTargetRealisasiCapaian } from '@/types';
import React, { useEffect, useState } from 'react';
import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataPerencanaanRealisasi';
import TableTujuanOpd from './_components/TableTujuanOpd';

const TujuanPage = () => {
    const kodeOpd = "5.03.5.04.0.00.01.0000"
    const tahunawal = 2025
    const tahunakhir = 2030
    const periode = [2025]
    const { url } = useApiUrlContext();
    const { data: tujuanOpdData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<TujuanOpdPerencanaanResponse>({ url: `${url}/api/v1/perencanaan/tujuan_opd/findall/${kodeOpd}/tahunawal/${tahunawal}/tahunakhir/${tahunakhir}/jenisperiode/rpjmd` });
    const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<TujuanOpdRealisasiResponse>({ url: `${url}/api/v1/realisasi/tujuan_opd/${kodeOpd}/by-periode/${tahunawal}/${tahunakhir}/rpjmd` });
    const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<TujuanOpdTargetRealisasiCapaian[]>([]);
    const [PerencanaanTujuanOpd, setPerencanaanTujuanOpd] = useState<TujuanOpd[]>([]);
    const [NamaOpd, setNamaOpd] = useState<string>("");

    useEffect(() => {
        if (tujuanOpdData?.data && realisasiData) {
            const perencanaan = tujuanOpdData.data
            const tujuanOpds: TujuanOpd[] = perencanaan.flatMap(tj => tj.tujuan_opd)
            setPerencanaanTujuanOpd(tujuanOpds)

            setNamaOpd(perencanaan[0].nama_opd)

            const combinedData = gabunganDataPerencanaanRealisasi(perencanaan, realisasiData)
            setTargetRealisasiCapaian(combinedData)
        } else {
            setNamaOpd('')
            setTargetRealisasiCapaian([])
            setPerencanaanTujuanOpd([])
        }
    }, [tujuanOpdData, realisasiData])


    if (perencanaanLoading || realisasiLoading) return <LoadingBeat loading={perencanaanLoading} />;
    if (perencanaanError) return <div>Error fetching perencanaan: {perencanaanError}</div>;
    if (realisasiError) return <div>Error fetching realisasi: {realisasiError}</div>;

    /* const handleOpenModal = (tujuan: TujuanPemda, data: TargetRealisasiCapaian[]) => { // tujuan -> buat text diatas sama filter
*     const targetCapaian = data.filter(tc => tc.tujuanId === tujuan.id.toString())

*     if (targetCapaian) {
*         setSelectedTujuan(targetCapaian); // Set the selected purpose to the found target capaian
*     } else {
*         console.warn('No matching target capaian found for the selected tujuan');
*         setSelectedTujuan([]); // Optionally reset if nothing is found to avoid stale data
*     }
*     setOpenModal(true);
* }; */

    return (
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan {NamaOpd}</h2>
            <TableTujuanOpd
                periode={periode}
                tujuanOpd={PerencanaanTujuanOpd}
                targetRealisasiCapaians={TargetRealisasiCapaian}
            />
        </div>
    )
}

export default TujuanPage
