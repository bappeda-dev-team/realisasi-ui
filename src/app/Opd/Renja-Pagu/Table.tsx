'use client'

import React, { useEffect, useState } from "react";
import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { RenjaPaguTarget } from "@/types";

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

const dummyData: RenjaPaguRow[] = [
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
                pagu: 50000000,
                targetId: "1",
                realisasi: 35000000,
                satuan: "Rupiah",
                tahun: "2025",
                jenisRealisasi: "NAIK",
                capaian: "70.00",
                keteranganCapaian: "Pembayaran tahap 1",
            },
        ],
    },
];

const Table = () => {
    const [rows, setRows] = useState<RenjaPaguRow[]>([]);
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
        ? "Pilih dan aktifkan tahun agar data renja pagu OPD muncul."
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
                    Memuat data renja pagu OPD...
                </p>
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="rounded border border-purple-200 px-4 py-6 text-center text-sm text-gray-600">
                Data renja pagu OPD untuk tahun {activatedTahun} belum tersedia.
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
                            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{activatedTahun || "2025"}</th>
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
        </>
    );
};

export default Table;