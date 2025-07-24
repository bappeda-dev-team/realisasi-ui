'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { FormModal } from "@/components/Global/Modal";
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { useFetchData } from '@/hooks/useFetchData';
import { TujuanOpdPerencanaan, TujuanOpdPerencanaanResponse, TujuanOpdRealisasi, TujuanOpdRealisasiResponse, TujuanOpdTargetRealisasiCapaian } from '@/types';
import React, { useEffect, useState } from 'react';
import FormRealisasiTujuanOpd from './_components/FormRealisasiTujuanOpd';
import TableTujuanOpd from './_components/TableTujuanOpd';
import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataPerencanaanRealisasi';

export default function TujuanPage() {
    const kodeOpd = "5.03.5.04.0.00.01.0000"
    const tahun = 2025
    const { url } = useApiUrlContext();
    const { data: tujuanOpdData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<TujuanOpdPerencanaanResponse>({ url: `${url}/api/v1/perencanaan/tujuan_opd/opd/${kodeOpd}/by-tahun/${tahun}` });
    const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<TujuanOpdRealisasiResponse>({ url: `${url}/api/v1/realisasi/tujuan_opd/${kodeOpd}/by-tahun/${tahun}` });
    const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<TujuanOpdTargetRealisasiCapaian[]>([]);
    const [PerencanaanTujuanOpd, setPerencanaanTujuanOpd] = useState<TujuanOpdPerencanaan[]>([]);
    const [NamaOpd, setNamaOpd] = useState<string>("");
    const [OpenModal, setOpenModal] = useState<boolean>(false);
    const [TujuanOpdSelected, setTujuanOpdSelected] = useState<TujuanOpdTargetRealisasiCapaian[]>([]);

    useEffect(() => {
        if (tujuanOpdData?.data && realisasiData) {
            const perencanaan = tujuanOpdData.data
            setPerencanaanTujuanOpd(perencanaan)

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

    const handleOpenModal = (tujuan: TujuanOpdPerencanaan, dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[]) => { // tujuan -> buat text diatas sama filter
        const targetCapaian = dataTargetRealisasi.filter(tc => tc.tujuanId === tujuan.id_tujuan_opd)

        if (targetCapaian) {
            console.log(targetCapaian)
            setTujuanOpdSelected(targetCapaian); // Set the selected purpose to the found target capaian
        } else {
            console.warn('No matching target capaian found for the selected tujuan');
            setTujuanOpdSelected([]); // Optionally reset if nothing is found to avoid stale data
        }
        setOpenModal(true);
    };

    return (
        <div className="overflow-auto grid gap-2">
            <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan OPD - {NamaOpd} Tahun {tahun}</h2>
            <TableTujuanOpd
                tahun={tahun}
                tujuanOpd={PerencanaanTujuanOpd}
                targetRealisasiCapaians={TargetRealisasiCapaian}
                handleOpenModal={handleOpenModal}
            />
            <FormModal
                isOpen={OpenModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                title={`Realisasi Tujuan OPD - ${TujuanOpdSelected[0]?.tujuanOpd ?? ''}`}
            >
                <FormRealisasiTujuanOpd
                    requestValues={TujuanOpdSelected}
                    onClose={() => {
                        setOpenModal(false);
                    }}
                    onSuccess={(result: TujuanOpdRealisasi[]) => {
                        const updated = gabunganDataPerencanaanRealisasi(PerencanaanTujuanOpd, result)
                        setTargetRealisasiCapaian(updated)
                    }}
                />
            </FormModal>
        </div>
    )
}
