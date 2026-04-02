"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { useFetchData } from "@/hooks/useFetchData";
import {
    PerencanaanTujuanPemda,
    PerencanaanTujuanPemdaResponse,
    RealisasiTujuan,
    RealisasiTujuanResponse,
    TargetRealisasiCapaian,
    TujuanPemda,
} from "@/types";
import React, { useEffect, useState, useMemo } from "react";
import { ModalTujuanPemda } from "./_components/ModalTujuan";
import TableTujuan from "./_components/TableTujuan";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataPerencanaanRealisasi";
import { useFilterContext } from "@/context/FilterContext";
import { parsePeriodeRange } from "@/lib/filter";

export default function Tujuan() {
    const { activeFilter } = useFilterContext();
    const { tahunAwal, tahunAkhir, tahunList } = useMemo(
        () => parsePeriodeRange(activeFilter.periode),
        [activeFilter.periode],
    );
    const selectedTahun = activeFilter.tahun;
    const jenisPeriode = "rpjmd";

    const canFetchPerencanaan =
        typeof tahunAwal === "number" && typeof tahunAkhir === "number";


    // FETCH DATA
    const {
        data: perencanaanData,
        loading: perencanaanLoading,
        error: perencanaanError,
    } = useFetchData<PerencanaanTujuanPemdaResponse>({
        url: canFetchPerencanaan
            ? `/api/perencanaan/tujuan_pemda/findall_with_pokin/${tahunAwal}/${tahunAkhir}/${jenisPeriode}`
            : null,
    });

    const {
        data: realisasiData,
        loading: realisasiLoading,
        error: realisasiError,
    } = useFetchData<RealisasiTujuanResponse>({
        url: selectedTahun
            ? `/api/realisasi/tujuans/by-tahun/${selectedTahun}`
            : null,
    });


    // state
    const [dataTargetRealisasi, setDataTargetRealisasi] =
        useState<TargetRealisasiCapaian[]>([]);
    const [tujuansPemda, setTujuansPemda] = useState<TujuanPemda[]>([]);
    const [OpenModal, setOpenModal] = useState<boolean>(false);
    const [selectedTujuan, setSelectedTujuan] = useState<
        TargetRealisasiCapaian[]
    >([]);
    const [perencanaanTujuan, setPerencanaanTujuan] = useState<
        PerencanaanTujuanPemda[]
    >([]);

    // Effect
    useEffect(() => {
        if (!perencanaanData?.data || !realisasiData) return;

        const perencanaan = perencanaanData.data;
        setPerencanaanTujuan(perencanaan);

        setDataTargetRealisasi(
            gabunganDataPerencanaanRealisasi(perencanaan, realisasiData),
        );

        setTujuansPemda(
            perencanaan.flatMap(pokin => pokin.tujuan_pemda),
        );
    }, [perencanaanData, realisasiData]);

    if (selectedTahun === null || tahunList.length === 0)
        return (
            <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
                Harap pilih periode dan tahun dahulu
            </div>
        );
    /* if (!perencanaanData || !realisasiData) return <LoadingBeat loading={perencanaanLoading} />; */
    if (perencanaanLoading || realisasiLoading)
        return <LoadingBeat loading={perencanaanLoading} />;
    if (perencanaanError)
        return <div>Error fetching perencanaan: {perencanaanError}</div>;
    if (realisasiError)
        return <div>Error fetching realisasi: {realisasiError}</div>;

    const handleOpenModal = (
        tujuan: TujuanPemda,
        data: TargetRealisasiCapaian[],
    ) => {
        // tujuan -> buat text diatas sama filter
        const targetCapaian = data.filter(
            (tc) => tc.tujuanId === tujuan.id.toString(),
        );

        if (targetCapaian) {
            setSelectedTujuan(targetCapaian); // Set the selected purpose to the found target capaian
        } else {
            console.warn("No matching target capaian found for the selected tujuan");
            setSelectedTujuan([]); // Optionally reset if nothing is found to avoid stale data
        }
        setOpenModal(true);
    };

    // here's the magic
    // filter the fkin periode
    const periodeTampil = tahunList.filter((p) => p === Number(selectedTahun));

    return (
        <div className="overflow-auto grid gap-2">
            <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan Pemda</h2>
            <div className="mt-2 rounded-t-lg border border-red-400">
                <TableTujuan
                    periode={periodeTampil}
                    tujuansPemda={tujuansPemda}
                    targetRealisasiCapaians={dataTargetRealisasi}
                    handleOpenModal={handleOpenModal}
                />
                <ModalTujuanPemda
                    item={selectedTujuan}
                    isOpen={OpenModal}
                    onClose={() => {
                        setOpenModal(false);
                    }}
                    onSuccess={(result: RealisasiTujuan[]) => {
                        const updated = gabunganDataPerencanaanRealisasi(
                            perencanaanTujuan,
                            result,
                        );
                        setDataTargetRealisasi(updated);
                    }}
                />
            </div>
        </div>
    );
}
