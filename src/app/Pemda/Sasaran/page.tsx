'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { useFetchData } from '@/hooks/useFetchData';
import React, { useEffect, useState } from 'react'
import { gabunganDataSasaranRealisasi } from './_lib/helper';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { PerencanaanSasaranPemdaResponse, RealisasiSasaranResponse, TargetRealisasiCapaian } from '@/types'
import TableSasaran from './_components/TableSasaran';

const SasaranPage = () => {
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: sasaranData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<PerencanaanSasaranPemdaResponse>({ url: `${url}/api/v1/perencanaan/sasaran_pemda/by-tahun/${tahun}` });
    // const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<RealisasiSasaranResponse>({ url: `${url}/api/v1/realisasi/sasarans/by-tahun/2025` });
    // const [targetRealisasiCapaian, setTargetRealisasiCapaian] = useState<TargetRealisasiCapaian>();

    useEffect(() => {
        console.log('Sasaran Data:', sasaranData);
    }, [sasaranData])

    return (
        <div className="overflow-auto grid gap-2">
            <h2 className="text-lg font-semibold mb-2">Realisasi Sasaran Pemda</h2>
            <div className="mt-2 rounded-t-lg border border-red-400">
                <table className="w-full">
                    <thead>
                        <tr className="text-white bg-red-400">
                            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[400px] text-center">Sasaran</th>
                            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Indikator</th>
                            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[100px] text-center">Aksi</th>
                            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Sumber Data</th>
                            <th key={tahun} colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">
                                {tahun}
                            </th>
                            <th rowSpan={2} className="border-b py-4 px-6 border-gray-300 min-w-[100px] text-center">Keterangan</th>
                        </tr>
                        <tr className="text-white bg-red-500">
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SasaranPage
