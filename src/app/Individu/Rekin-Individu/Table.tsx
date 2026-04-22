'use client'

import React, { useMemo, useState, useEffect } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import FormRealisasiRekinIndividu from "./_components/FormRealisasiRekinIndividu";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useFetchData } from "@/hooks/useFetchData";
import { getMonthName } from "@/lib/months";
import { RekinIndividuResponse, RekinTarget } from "@/types";

interface TableRow {
    id: number;
    rekin: string;
    nama_pegawai: string;
    nip: string;
    indikator: string;
    sasaran: string;
    targets: RekinTarget[];
}

const Table = () => {
    const { user } = useUserContext();
    const { tahun: selectedTahun, activatedTahun, activatedBulan } = useFilterContext();
    const [rows, setRows] = useState<TableRow[]>([]);
    const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const yearLabel = activatedTahun;
    const monthLabel = getMonthName(activatedBulan);

    const apiUrl = useMemo(() => {
        if (!user?.nip || !yearLabel || !monthLabel) return null;
        return `/api/v1/realisasi/rekin/by-nip/${encodeURIComponent(
            user.nip,
        )}/by-tahun/${encodeURIComponent(yearLabel)}/by-bulan/${encodeURIComponent(monthLabel)}`;
    }, [user?.nip, yearLabel, monthLabel]);

    const { data, loading, error } = useFetchData<RekinIndividuResponse[]>({
        url: apiUrl,
    });

    useEffect(() => {
        if (!yearLabel) {
            setRows([]);
            setIsModalOpen(false);
            setSelectedRow(null);
            return;
        }

        if (!data || !user) {
            setRows([]);
            return;
        }

        const namaPegawaiParts = [user.firstName, user.lastName].filter(Boolean);
        const namaPegawai = namaPegawaiParts.join(" ").trim() || "Pengguna";

        setRows(
            data.map((item) => {
                const target: RekinTarget = {
                    targetRealisasiId: item.id ?? null,
                    rekinId: item.rekinId,
                    rekin: item.rekin ?? "-",
                    nip: item.nip ?? user.nip ?? "-",
                    indikatorId: item.indikatorId ?? "",
                    indikator: item.indikator ?? "-",
                    targetId: item.targetId,
                    target: item.target ?? "-",
                    realisasi: item.realisasi ?? 0,
                    satuan: item.satuan ?? "-",
                    tahun: item.tahun ?? yearLabel,
                    bulan: item.bulan ?? monthLabel ?? undefined,
                    jenisRealisasi: item.jenisRealisasi ?? "NAIK",
                    capaian: item.capaian ?? "-",
                    keteranganCapaian: item.keteranganCapaian ?? "-",
                    idSasaran: item.idSasaran,
                    sasaran: item.sasaran,
                };

                return {
                    id: item.id,
                    rekin: item.rekin ?? "-",
                    nama_pegawai: namaPegawai,
                    nip: item.nip ?? user.nip ?? "-",
                    indikator: item.indikator ?? "-",
                    sasaran: item.sasaran ?? "-",
                    targets: [target],
                };
            }),
        );
    }, [data, user, yearLabel]);

    const handleOpenModal = (row: TableRow) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleRealisasiSuccess = (updatedTargets: RekinTarget[]) => {
        const rowId = selectedRow?.id;
        setRows((current) =>
            current.map((row) =>
                row.id === rowId
                    ? {
                          ...row,
                          targets: updatedTargets,
                      }
                    : row,
            ),
        );
        handleCloseModal();
    };

    const modalValues = useMemo(
        () => selectedRow?.targets ?? [],
        [selectedRow],
    );

    const infoMessage = !user?.nip
        ? "Silakan login terlebih dahulu untuk melihat data rekin individu."
        : !yearLabel || !monthLabel
          ? "Harap pilih tahun dan bulan dahulu"
          : undefined;

    if (infoMessage) {
        return (
            <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
                {infoMessage}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded border border-emerald-200 px-4 py-6 text-center">
                <LoadingBeat loading={true} />
                <p className="text-sm text-gray-600 mt-2">
                    Memuat data rekin individu...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
                Gagal memuat data rekin individu: {error}
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="rounded border border-emerald-200 px-4 py-6 text-center text-sm text-gray-600">
                Data rekin individu untuk tahun {yearLabel} belum tersedia.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-emerald-500 text-white">
                            <td
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 max-w-[100px] text-center"
                            >
                                No
                            </td>
                            <td
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[400px] text-center"
                            >
                                Rencana Kinerja
                            </td>
                            <td
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[200px]"
                            >
                                Nama Pemilik
                            </td>
                            <td
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[300px]"
                            >
                                Indikator
                            </td>
                            <td
                                rowSpan={2}
                                className="border-r border-b px-6 py-3 min-w-[250px]"
                            >
                                Sasaran
                            </td>
                            
                            <th colSpan={6} className="border-l border-b px-6 py-3 min-w-[100px]">
                                {yearLabel} - {monthLabel}
                            </th>
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Realisasi</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((item, index) => {
                            const target = item.targets[0];
                            return (
                                <tr key={item.id}>
                                    <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.rekin || "-"}
                                    </td>
                                    <td className="flex flex-col border-r border-b border-emerald-500 px-6 py-4">
                                        <p>{item.nama_pegawai || "-"}</p>
                                        <p>({item.nip || "-"})</p>
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            <p>{item.indikator || "-"}</p>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.sasaran || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {target?.target || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4 align-top">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>{target?.realisasi ?? "-"}</span>
                                            <ButtonGreenBorder
                                                className="w-full"
                                                onClick={() => handleOpenModal(item)}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {target?.satuan || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {target?.capaian || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
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
                onClose={handleCloseModal}
                title={`Realisasi ${selectedRow?.rekin ?? ""}`}
            >
                <FormRealisasiRekinIndividu
                    requestValues={modalValues}
                    onClose={handleCloseModal}
                    onSuccess={handleRealisasiSuccess}
                />
            </FormModal>
        </>
    );
};

export default Table;
