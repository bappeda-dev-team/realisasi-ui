'use client'

import React, { useEffect, useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useFetchData } from "@/hooks/useFetchData";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { RenjaPaguIndividuResponse, RenjaPaguTarget } from "@/types";
import FormRealisasiRenjaPagu from "./_components/FormRealisasiRenjaPagu";

interface RenjaPaguRow {
    id: number;
    renja: string;
    nama_pegawai: string;
    nip: string;
    kodeRenja: string;
    jenisRenja: string;
    indikator: string;
    targets: RenjaPaguTarget[];
}

const Table = () => {
    const [rows, setRows] = useState<RenjaPaguRow[]>([]);
    const [selectedRow, setSelectedRow] = useState<RenjaPaguRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { tahun: selectedTahun, activatedTahun } = useFilterContext();
    const { user } = useUserContext();
    const { url } = useApiUrlContext();

    const apiUrl = url && user?.nip && activatedTahun
        ? `${url}/api/v1/realisasi/renja_pagu_individu/nip/${encodeURIComponent(user.nip)}/by-tahun/${encodeURIComponent(activatedTahun)}`
        : null;

    const { data, loading, error } = useFetchData<RenjaPaguIndividuResponse[]>({
        url: apiUrl,
    });

    useEffect(() => {
        if (!activatedTahun) {
            setRows([]);
            return;
        }

        if (!data) {
            setRows([]);
            return;
        }

        const namaPegawaiParts = [user?.firstName, user?.lastName].filter(Boolean);
        const namaPegawai = namaPegawaiParts.join(" ").trim() || "Pengguna";

        setRows(
            data.map((item) => ({
                id: item.id,
                renja: item.renja ?? "-",
                nama_pegawai: namaPegawai,
                nip: item.nip ?? user?.nip ?? "-",
                kodeRenja: item.kodeRenja ?? "-",
                jenisRenja: item.jenisRenja ?? "-",
                indikator: item.indikator ?? "-",
                targets: [{
                    targetRealisasiId: item.id ?? null,
                    renjaId: item.renjaId,
                    renja: item.renja ?? "-",
                    kodeRenja: item.kodeRenja ?? "-",
                    jenisRenja: item.jenisRenja ?? "-",
                    nip: item.nip ?? user?.nip ?? "-",
                    idIndikator: item.idIndikator,
                    indikator: item.indikator ?? "-",
                    pagu: item.pagu,
                    targetId: item.idIndikator,
                    realisasi: item.realisasi,
                    satuan: item.satuan,
                    tahun: item.tahun,
                    jenisRealisasi: item.jenisRealisasi,
                    capaian: item.capaian ?? "-",
                    keteranganCapaian: item.keteranganCapaian ?? "-",
                }],
            }))
        );
    }, [data, user, activatedTahun]);

    const openModal = (row: RenjaPaguRow) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleRealisasiSuccess = (updatedTargets: RenjaPaguTarget[]) => {
        if (!selectedRow) return;
        setRows((previous) =>
            previous.map((row) =>
                row.id === selectedRow.id ? { ...row, targets: updatedTargets } : row
            )
        );
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const infoMessage = !user?.nip
        ? "Silakan login terlebih dahulu untuk melihat data renja pagu individu."
        : !activatedTahun
            ? "Pilih dan aktifkan tahun agar data renja pagu individu muncul."
            : undefined;

    if (infoMessage) {
        return (
            <div className="rounded border border-purple-200 px-4 py-6 text-center text-sm text-gray-600">
                {infoMessage}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded border border-purple-200 px-4 py-6 text-center">
                <LoadingBeat loading={true} />
                <p className="text-sm text-gray-600 mt-2">
                    Memuat data renja pagu individu...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
                Gagal memuat data renja pagu: {error}
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="rounded border border-purple-200 px-4 py-6 text-center text-sm text-gray-600">
                Data renja pagu untuk tahun {activatedTahun} belum tersedia.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-purple-600 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Rencana Kinerja</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pemilik</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">Jenis Renja</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[120px] text-center">Aksi</td>
                            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{activatedTahun}</th>
                        </tr>
                        <tr className="bg-purple-600 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Pagu</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Realisasi</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => {
                            const target = row.targets[0];
                            return (
                                <tr key={row.id}>
                                    <td className="border-x border-b border-purple-600 py-4 px-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {row.renja || "-"}
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {row.nama_pegawai || "-"} ({row.nip || "-"})
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{row.jenisRenja || "-"}</span>
                                            <span className="text-sm text-gray-500">({row.kodeRenja || "-"})</span>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {row.indikator || "-"}
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <ButtonGreenBorder
                                                className="flex items-center gap-1 justify-center"
                                                onClick={() => openModal(row)}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {target?.pagu?.toLocaleString() ?? "-"}
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {target?.realisasi?.toLocaleString() ?? "-"}
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {target?.satuan || "-"}
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {target?.capaian || "-"}
                                    </td>
                                    <td className="border-r border-b border-purple-600 px-6 py-4">
                                        {target?.keteranganCapaian || "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <FormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={`Realisasi Renja Pagu - ${selectedRow?.nama_pegawai ?? selectedRow?.renja ?? ""}`}
            >
                <FormRealisasiRenjaPagu
                    requestValues={selectedRow?.targets ?? []}
                    onClose={closeModal}
                    onSuccess={handleRealisasiSuccess}
                />
            </FormModal>
        </>
    );
};

export default Table;