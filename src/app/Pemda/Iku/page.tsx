'use client'

import { useFetchData } from '@/hooks/useFetchData';
import React, { useEffect, useState } from 'react'
/* import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataSasaranRealisasi'; */
import { useApiUrlContext } from '@/context/ApiUrlContext';
import TableIku from './_components/TableIku'
import { IkuPemdaPerencanaanResponse, IkuPemda } from '@/types'

const IkuPage = () => {
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: ikuPerencanaan, loading: perencanaanLoading, error: perencanaanError } = useFetchData<IkuPemdaPerencanaanResponse>({ url: `${url}/api/v1/perencanaan/indikator_utama/by-tahun/${tahun}` });
    const [PerencanaanIku, setPerencanaanIku] = useState<IkuPemda[]>([]);
    /* const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<TargetRealisasiCapaianIkuPemda[]>([]); */


    useEffect(() => {
        if (ikuPerencanaan?.data) {
            const perencanaan = ikuPerencanaan.data
            setPerencanaanIku(perencanaan)

            /* const combinedData = gabunganDataPerencanaanRealisasi(perencanaan, realisasiData)
* setTargetRealisasiCapaian(combinedData) */
        }
    }, [ikuPerencanaan])

    return (
        <div className="overflow-auto grid gap-2">
            <h2 className="text-lg font-semibold mb-2">Realisasi IKU Pemda</h2>
            <div className="mt-2 rounded-t-lg border border-red-400">
                <TableIku
                    tahun={tahun}
                    ikuPemda={PerencanaanIku}
                />
            </div>
        </div>
    )
}

export default IkuPage
