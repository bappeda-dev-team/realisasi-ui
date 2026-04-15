'use client'

import React, { useEffect, useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { RenjaTarget } from "@/types";
import FormRealisasiRenjaTarget from "@/app/Individu/Renja/_components/FormRealisasiRenjaTarget";
import FormRealisasiRenjaPagu from "@/app/Individu/Renja/_components/FormRealisasiRenjaPagu";

interface RenjaRow {
    id: number;
    renja: string;
    nama_pegawai: string;
    nip: string;
    kodeRenja: string;
    jenisRenja: string;
    indikator: string;
    targets: RenjaTarget[];
}

const dummyData: RenjaRow[] = [
    {
        id: 1,
        renja: "Penyusunan Dokumen Perencanaan",
        nama_pegawai: "Ahmad Santoso",
        nip: "197501012005011001",
        kodeRenja: "01.0.00.001",
        jenisRenja: "KEGIATAN",
        indikator: "Jumlah dokumen perencanaan yang disusun",
        targets: [
            {
                targetRealisasiId: 1,
                renjaId: "1",
                renja: "Penyusunan Dokumen Perencanaan",
                kodeRenja: "01.0.00.001",
                jenisRenja: "KEGIATAN",
                nip: "197501012005011001",
                idIndikator: "1",
                indikator: "Jumlah dokumen perencanaan yang disusun",
                targetId: "1",
                target: "12",
                realisasi: 8,
                satuan: "Dokumen",
                tahun: "2025",
                jenisRealisasi: "NAIK",
                capaian: "66.67",
                keteranganCapaian: "Sedang dalam proses",
                pagu: 150000000,
                realisasiPagu: 75000000,
                satuanPagu: "Rupiah",
                capaianPagu: "50",
                keteranganCapaianPagu: "Sedang dalam proses",
            },
        ],
    },
];

const Table = () => {
    const [rows, setRows] = useState<RenjaRow[]>([]);
    const [selectedRow, setSelectedRow] = useState<RenjaRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'target' | 'pagu'>('target');

    const { activatedTahun } = useFilterContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            setRows(dummyData);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const openModal = (row: RenjaRow, type: 'target' | 'pagu' = 'target') => {
        setSelectedRow(row);
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
        setModalType('target');
    };

    const handleRealisasiSuccess = (updatedTargets: RenjaTarget[]) => {
        if (!selectedRow) return;
        setRows((previous) =>
            previous.map((row) =>
                row.id === selectedRow.id ? { ...row, targets: updatedTargets } : row
            )
        );
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const infoMessage = !activatedTahun
        ? "Pilih dan aktifkan tahun agar data renja OPD muncul."
        : undefined;

    if (infoMessage) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center text-sm text-gray-600">
                {infoMessage}
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center">
                <LoadingBeat loading={true} />
                <p className="text-sm text-gray-600 mt-2">
                    Memuat data renja OPD...
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-sky-600 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Rencana Kerja</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pemilik</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">Jenis Renja</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[120px] text-center">Aksi</td>
                            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{`Renja Target ${activatedTahun || "2025"}`}</th>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[120px] text-center">Aksi</td>
                            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{`Renja Pagu ${activatedTahun || "2025"}`}</th>
                        </tr>
                        <tr className="bg-sky-600 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => {
                            const target = row.targets[0];
                            return (
                                <tr key={row.id}>
                                    <td className="border-x border-b border-sky-600 py-4 px-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {row.renja || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {row.nama_pegawai || "-"} ({row.nip || "-"})
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{row.jenisRenja || "-"}</span>
                                            <span className="text-sm text-gray-500">({row.kodeRenja || "-"})</span>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {row.indikator || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <ButtonGreenBorder
                                                className="flex items-center gap-1 justify-center"
                                                onClick={() => openModal(row, 'target')}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.target || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.realisasi ?? "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.satuan || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.capaian || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.keteranganCapaian || "-"}
                                    </td>
                                    <td className="border-x border-b border-sky-600 px-6 py-4">
                                        <div className="flex flex-col gap-2">
                                            <ButtonGreenBorder
                                                className="flex items-center gap-1 justify-center"
                                                onClick={() => openModal(row, 'pagu')}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.pagu != null ? target.pagu.toLocaleString() : "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.realisasiPagu != null ? target.realisasiPagu.toLocaleString() : "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.satuanPagu || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.capaianPagu || "-"}
                                    </td>
                                    <td className="border-x border-b border-sky-600 px-6 py-4">
                                        {target?.keteranganCapaianPagu || "-"}
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
                title={`Realisasi Renja ${modalType === 'pagu' ? 'Pagu' : 'Target'} - ${selectedRow?.nama_pegawai ?? selectedRow?.renja ?? ""}`}
            >
                {modalType === 'pagu' ? (
                    <FormRealisasiRenjaPagu
                        requestValues={selectedRow?.targets ?? []}
                        onClose={closeModal}
                        onSuccess={handleRealisasiSuccess}
                    />
                ) : (
                    <FormRealisasiRenjaTarget
                        requestValues={selectedRow?.targets ?? []}
                        onClose={closeModal}
                        onSuccess={handleRealisasiSuccess}
                    />
                )}
            </FormModal>
        </>
    );
};

export default Table;
