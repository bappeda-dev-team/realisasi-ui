'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { useFetchData } from '@/hooks/useFetchData';
import React, { useEffect, useState } from 'react'
import { gabunganDataSasaranRealisasi } from './_lib/helper';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { PerencanaanSasaranPemdaResponse, RealisasiSasaranResponse, SasaranPemda, TargetRealisasiCapaian } from '@/types'
import TableSasaran from './_components/TableSasaran';

const SasaranPage = () => {
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: sasaranData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<PerencanaanSasaranPemdaResponse>({ url: `${url}/api/v1/perencanaan/sasaran_pemda/by-tahun/${tahun}` });
    // const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<RealisasiSasaranResponse>({ url: `${url}/api/v1/realisasi/sasarans/by-tahun/2025` });
    // const [targetRealisasiCapaian, setTargetRealisasiCapaian] = useState<TargetRealisasiCapaian>();
    const [PerencanaanSasaran, setPerencanaanSasaran] = useState<SasaranPemda[]>([]);

    useEffect(() => {
        if (sasaranData?.data) {
            const perencanaan = sasaranData.data
            setPerencanaanSasaran(perencanaan)
        }
    }, [sasaranData])

    if (perencanaanLoading) return <LoadingBeat loading={perencanaanLoading} />;
    if (perencanaanError) return <div>Error fetching perencanaan: {perencanaanError}</div>;

    return (
        <div className="overflow-auto grid gap-2">
            <h2 className="text-lg font-semibold mb-2">Realisasi Sasaran Pemda</h2>
            <div className="mt-2 rounded-t-lg border border-red-400">
                <TableSasaran
                    tahun={tahun}
                    sasaranPemda={PerencanaanSasaran}
                />
            </div>
        </div>
    )
}

export default SasaranPage
