'use client'

import { LoadingBeat } from '@/components/Global/Loading';
import { useApiUrlContext } from '@/context/ApiUrlContext';
import { useFetchData } from '@/hooks/useFetchData';
import { TujuanOpd, TujuanOpdPerencanaan, TujuanOpdPerencanaanResponse, TujuanOpdRealisasiResponse, TujuanOpdTargetRealisasiCapaian, TujuanOpdRealisasi } from '@/types';
import React, { useEffect, useState } from 'react';
import { gabunganDataPerencanaanRealisasi } from './_lib/gabunganDataPerencanaanRealisasi';
import TableTujuanOpd from './_components/TableTujuanOpd';
import { FormModal } from "@/components/Global/Modal";
import FormRealisasiTujuanOpd from './_components/FormRealisasiTujuanOpd';

const TujuanPage = () => {
    const kodeOpd = "5.03.5.04.0.00.01.0000"
    const tahunawal = 2025
    const tahunakhir = 2030
    const periode = [2025]
    const { url } = useApiUrlContext();
    const { data: tujuanOpdData, loading: perencanaanLoading, error: perencanaanError } = useFetchData<TujuanOpdPerencanaanResponse>({ url: `${url}/api/v1/perencanaan/tujuan_opd/findall/${kodeOpd}/tahunawal/${tahunawal}/tahunakhir/${tahunakhir}/jenisperiode/rpjmd` });
    const { data: realisasiData, loading: realisasiLoading, error: realisasiError } = useFetchData<TujuanOpdRealisasiResponse>({ url: `${url}/api/v1/realisasi/tujuan_opd/${kodeOpd}/by-periode/${tahunawal}/${tahunakhir}/rpjmd` });
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

    const handleOpenModal = (tujuan: TujuanOpd, dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[]) => { // tujuan -> buat text diatas sama filter
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
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan {NamaOpd}</h2>
            <TableTujuanOpd
                periode={periode}
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

export default TujuanPage
