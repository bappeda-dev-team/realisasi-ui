'use client'

import { useFetchData } from '@/hooks/useFetchData';
import React, { useEffect, useState } from 'react'
import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataSasaranRealisasi';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import TableIku from './_components/TableIku'
import { IkuPemdaPerencanaanResponse, IkuPemdaRealisasiResponse, IkuPemda, IkuPemdaTargetRealisasiCapaian } from '@/types'

const IkuPage = () => {
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: ikuPerencanaan, loading: perencanaanLoading, error: perencanaanError } = useFetchData<IkuPemdaPerencanaanResponse>({ url: `${url}/api/v1/perencanaan/indikator_utama/by-tahun/${tahun}` });
    const { data: ikuRealisasi, loading: realisasiLoading, error: realisasiError } = useFetchData<IkuPemdaRealisasiResponse>({ url: `${url}/api/v1/realisasi/ikus/by-tahun/${tahun}` });
    const [PerencanaanIku, setPerencanaanIku] = useState<IkuPemda[]>([]);
    const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<IkuPemdaTargetRealisasiCapaian[]>([]);


    useEffect(() => {
        if (ikuPerencanaan?.data && ikuRealisasi) {
            const perencanaan = ikuPerencanaan.data
            setPerencanaanIku(perencanaan)

            const combinedData = gabunganDataPerencanaanRealisasi(perencanaan, ikuRealisasi)
            setTargetRealisasiCapaian(combinedData)
        }
    }, [ikuPerencanaan, ikuRealisasi])

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
    )
}

export default IkuPage
