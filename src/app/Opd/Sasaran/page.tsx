'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import React, { useEffect, useState } from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { SasaranOpdPerencanaanResponse, SasaranOpdPerencanaan } from '@/types'
import { useApiUrlContext } from '@/context/ApiUrlContext';
import TableSasaranOpd from './_components/TableSasaranOpd';

export default function SasaranPage() {
    const kodeOpd = "5.03.5.04.0.00.01.0000"
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: sasaranOpdData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<SasaranOpdPerencanaanResponse>({ url: `${url}/api/v1/perencanaan/sasaran_opd/opd/${kodeOpd}/by-tahun/${tahun}` });
    const [PerencanaanSasaranOpd, setPerencanaanSasaranOpd] = useState<SasaranOpdPerencanaan[]>([]);
    const [NamaOpd, setNamaOpd] = useState<string>("");

    useEffect(() => {
        if (sasaranOpdData?.data) {
            const perencanaan = sasaranOpdData.data
            setPerencanaanSasaranOpd(perencanaan)

            setNamaOpd(perencanaan[0].nama_opd)
        } else {
            setNamaOpd('')
            setPerencanaanSasaranOpd([])
        }
    }, [sasaranOpdData])

    if (perencanaanLoading) return <LoadingBeat loading={perencanaanLoading} />;
    if (perencanaanError) return <div>Error fetching perencanaan: {perencanaanError}</div>;

    return (
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">Realisasi Sasaran OPD - {NamaOpd} Tahun {tahun}</h2>
            <TableSasaranOpd
                tahun={tahun}
                sasaranOpd={PerencanaanSasaranOpd}
            />
        </div>
    )
}
