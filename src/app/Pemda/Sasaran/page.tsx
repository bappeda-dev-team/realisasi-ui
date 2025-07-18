'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { useFetchData } from '@/hooks/useFetchData';
import React, { useEffect, useState } from 'react'
import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataSasaranRealisasi';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { PerencanaanSasaranPemdaResponse, RealisasiSasaran, RealisasiSasaranResponse, SasaranPemda, TargetRealisasiCapaianSasaran } from '@/types'
import TableSasaran from './_components/TableSasaran';
import { FormModal } from "@/components/Global/Modal";
import FormRealisasiSasaranPemda from './_components/FormRealisasiSasaranPemda';

const SasaranPage = () => {
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: sasaranData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<PerencanaanSasaranPemdaResponse>({ url: `${url}/api/v1/perencanaan/sasaran_pemda/by-tahun/${tahun}` });
    const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<RealisasiSasaranResponse>({ url: `${url}/api/v1/realisasi/sasarans/by-tahun/${tahun}` });
    const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<TargetRealisasiCapaianSasaran[]>([]);
    const [PerencanaanSasaran, setPerencanaanSasaran] = useState<SasaranPemda[]>([]);
    const [OpenModal, setOpenModal] = useState<boolean>(false);
    const [SelectedSasaran, setSelectedSasaran] = useState<TargetRealisasiCapaianSasaran[]>([]);

    useEffect(() => {
        if (sasaranData?.data && realisasiData) {
            const perencanaan = sasaranData.data
            setPerencanaanSasaran(perencanaan)

            const combinedData = gabunganDataPerencanaanRealisasi(perencanaan, realisasiData)
            console.log(realisasiData)
            setTargetRealisasiCapaian(combinedData)
        }
    }, [sasaranData, realisasiData])

    if (perencanaanLoading || realisasiLoading) return <LoadingBeat loading={perencanaanLoading} />;
    if (perencanaanError) return <div>Error fetching perencanaan: {perencanaanError}</div>;
    if (realisasiError) return <div>Error fetching realisasi: {realisasiError}</div>;


    // modal logic
    const handleOpenModal = (sasaran: SasaranPemda, dataTargetRealisasi: TargetRealisasiCapaianSasaran[]) => {
        // sasaran -> buat text diatas sama filter
        const targetCapaian = dataTargetRealisasi.filter(tc => tc.sasaranId === sasaran.id.toString())

        if (targetCapaian) {
            setSelectedSasaran(targetCapaian); // Set the selected purpose to the found target capaian
        } else {
            console.warn('No matching target capaian found for the selected sasaran');
            setSelectedSasaran([]); // Optionally reset if nothing is found to avoid stale data
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
                    title="Realisasi Sasaran"
                >
                    <FormRealisasiSasaranPemda
                        requestValues={SelectedSasaran}
                        onClose={() => {
                            setOpenModal(false);
                        }}
                        onSuccess={(result: RealisasiSasaran[]) => {
                            const updated = gabunganDataPerencanaanRealisasi(PerencanaanSasaran, result)
                            setTargetRealisasiCapaian(updated)
                        }}
                    />
                </FormModal>
            </div>
        </div>
    )
}

export default SasaranPage
