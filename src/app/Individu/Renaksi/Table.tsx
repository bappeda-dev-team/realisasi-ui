'use client'

import React, { useEffect, useState } from "react";
import { useBrandingContext } from "@/context/BrandingContext";

interface PemdaStrategicGoal {
    id: number;
    strategic_pemda: string;
    tujuan_pemda: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: {
        target: string;
        satuan: string;
    };
}

const data = [
    {
        "id": 1,
        "rekin": "_DUMMY_ Meningkatnya Kualitas Pelayanan Publik Perangkat Daerah",
        "nama_pegawai": "akun_test_level_3",
        "nip": "102741020",
        "indikator": "Indeks Kepuasan Masyarakat Badan Kepegawaian, Pendidikan dan Pelatihan",
        "target": {
            "target": "8000",
            "realisasi": "-",
            "satuan": "angka",
            "capaian": "-"
        }

    }
]

const Table = () => {

    const { branding } = useBrandingContext();

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-emerald-500 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Rencana Kinerja</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Nama Pemilik</td>
                            <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">Bulan 5</th>
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                                    {index + 1}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.rekin || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.nama_pegawai || "-"} ({item.nip || "-"})
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.target.target || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.target.realisasi || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.target.satuan || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.target.capaian || "-"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
