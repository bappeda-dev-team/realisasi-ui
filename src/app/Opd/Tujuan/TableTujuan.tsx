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
        "tujuan_opd": "Meningkatnya Kualitas Pelayanan Publik Perangkat Daerah",
        "indikator": "Indeks Kepuasan Masyarakat Badan Kepegawaian, Pendidikan dan Pelatihan",
        "rumus_perhitungan": "-",
        "sumber_data": "-",
        "target": {
            "target": "8000",
            "satuan": "angka"
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
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Tujuan OPD</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</td>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">2025</th>
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                                    {index + 1}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.tujuan_opd || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    <div className="flex gap-2 items-center">
                                        <p>{item.indikator || "-"}</p>
                                    </div>
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.rumus_perhitungan || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.sumber_data || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.target.target || "-"}
                                </td>
                                <td className="border-r border-b border-emerald-500 px-6 py-4">
                                    {item.target.satuan || "-"}
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
