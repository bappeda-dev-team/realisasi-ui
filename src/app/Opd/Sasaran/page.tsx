'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { FormModal } from "@/components/Global/Modal";
import React, { useEffect, useState } from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { SasaranOpdPerencanaanResponse, SasaranOpdPerencanaan, SasaranOpdRealisasiResponse, SasaranOpdTargetRealisasiCapaian, SasaranOpdRealisasi } from '@/types'
import { useApiUrlContext } from '@/context/ApiUrlContext';
import TableSasaranOpd from './_components/TableSasaranOpd';
import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataPerencanaanRealisasi';
import FormRealisasiSasaranOpd from './_components/FormRealisasiSasaranOpd';

export default function SasaranPage() {
    const kodeOpd = "5.03.5.04.0.00.01.0000"
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: sasaranOpdData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<SasaranOpdPerencanaanResponse>({ url: `${url}/api/v1/perencanaan/sasaran_opd/opd/${kodeOpd}/by-tahun/${tahun}` });
    const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<SasaranOpdRealisasiResponse>({ url: `${url}/api/v1/realisasi/sasaran_opd/${kodeOpd}/by-tahun/${tahun}` });
    const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<SasaranOpdTargetRealisasiCapaian[]>([]);
    const [PerencanaanSasaranOpd, setPerencanaanSasaranOpd] = useState<SasaranOpdPerencanaan[]>([]);
    const [NamaOpd, setNamaOpd] = useState<string>("");
    const [SasaranOpdSelected, setSasaranOpdSelected] = useState<SasaranOpdTargetRealisasiCapaian[]>([]);
    const [OpenModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        if (sasaranOpdData?.data && realisasiData) {
            const perencanaan = sasaranOpdData.data
            setPerencanaanSasaranOpd(perencanaan)

            setNamaOpd(perencanaan[0].nama_opd)
            const combinedData = gabunganDataPerencanaanRealisasi(perencanaan, realisasiData)
            setTargetRealisasiCapaian(combinedData)
        } else {
            setNamaOpd('')
            setTargetRealisasiCapaian([])
            setPerencanaanSasaranOpd([])
        }
    }, [sasaranOpdData, realisasiData])

    if (perencanaanLoading || realisasiLoading) return <LoadingBeat loading={perencanaanLoading} />;
    if (perencanaanError) return <div>Error fetching perencanaan: {perencanaanError}</div>;
    if (realisasiError) return <div>Error fetching realisasi: {realisasiError}</div>;

    const handleOpenModal = (sasaran: SasaranOpdPerencanaan, dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[]) => { // sasaran -> buat text diatas sama filter
        const targetCapaian = dataTargetRealisasi.filter(tc => tc.sasaranId === sasaran.id.toString())

        if (targetCapaian) {
            setSasaranOpdSelected(targetCapaian); // Set the selected purpose to the found target capaian
        } else {
            console.warn('No matching target capaian found for the selected tujuan');
            setSasaranOpdSelected([]); // Optionally reset if nothing is found to avoid stale data
        }
        setOpenModal(true);
    };

    return (
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">Realisasi Sasaran OPD - {NamaOpd} Tahun {tahun}</h2>
            <TableSasaranOpd
                tahun={tahun}
                sasaranOpd={PerencanaanSasaranOpd}
                targetRealisasiCapaians={TargetRealisasiCapaian}
                handleOpenModal={handleOpenModal}
            />
            <FormModal
                isOpen={OpenModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                title={`Realisasi Sasaran OPD - ${SasaranOpdSelected[0]?.sasaranOpd || ''}`}
            >
                <FormRealisasiSasaranOpd
                    requestValues={SasaranOpdSelected}
                    onClose={() => {
                        setOpenModal(false);
                    }}
                    onSuccess={(result: SasaranOpdRealisasi[]) => {
                        const updated = gabunganDataPerencanaanRealisasi(PerencanaanSasaranOpd, result)
                        setTargetRealisasiCapaian(updated)
                    }}
                />
            </FormModal>
        </div>
    )
}
