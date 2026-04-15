'use client'

import React, { useEffect, useState } from "react";
import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { RenjaTarget } from "@/types";

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
            },
        ],
    },
];

const Table = () => {
    const [rows, setRows] = useState<RenjaRow[]>([]);
    const [loading, setLoading] = useState(true);
    const { activatedTahun } = useFilterContext();

    useEffect(() => {
        const timer = setTimeout(() => {
            setRows(dummyData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const infoMessage = !activatedTahun
        ? "Pilih dan aktifkan tahun agar data renja target OPD muncul."
        : undefined;

    if (infoMessage) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center text-sm text-gray-600">
                {infoMessage}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center">
                <LoadingBeat loading={true} />
                <p className="text-sm text-gray-600 mt-2">
                    Memuat data renja target OPD...
                </p>
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center text-sm text-gray-600">
                Data renja target OPD untuk tahun {activatedTahun} belum tersedia.
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
                            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{activatedTahun || "2025"}</th>
                        </tr>
                        <tr className="bg-sky-600 text-white">
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
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Table;