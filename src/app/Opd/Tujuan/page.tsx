'use client'

import React, { useEffect, useState } from 'react'
import Table from './TableTujuan'
import { useFetchData } from '@/hooks/useFetchData';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { PerencanaanTujuanOpdResponse, PerencanaanTujuanOpd } from '@/types';

const TujuanPage = () => {
    const kodeOpd = "5.03.5.04.0.00.01.0000"
    const tahunawal = 2025
    const tahunakhir = 2030
    const { url } = useApiUrlContext();
    const { data: tujuanOpdData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<PerencanaanTujuanOpdResponse>({ url: `${url}/api/v1/perencanaan/tujuan_opd/findall/${kodeOpd}/tahunawal/${tahunawal}/tahunakhir/${tahunakhir}/jenisperiode/rpjmd` });
    const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<RealisasiSasaranResponse>({ url: `${url}/api/v1/realisasi/tujuan_opd/${kodeOpd}/by-periode/${tahunawal}/${tahunakhir}/rpjmd` });
    const [PerencanaanTujuanOpd, setPerencanaanTujuanOpd] = useState<PerencanaanTujuanOpd[]>([])

    useEffect(() => {
        if (tujuanOpdData?.data && realisasiData) {
            const perencanaan = tujuanOpdData.data
            setPerencanaanTujuanOpd(perencanaan)

            console.log('perencanaan: ', perencanaan)
            console.log('realisasi: ', realisasiData)
            /* const combinedData = gabunganDataPerencanaanRealisasi(perencanaan, realisasiData) */
            /* setTargetRealisasiCapaian(combinedData) */
        }
    }, [tujuanOpdData, realisasiData])

    return (
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan OPD</h2>
            <Table />
        </div>
    )
}

export default TujuanPage
