'use client'

import React, { useEffect, useState } from "react";
import { useBrandingContext } from "@/context/BrandingContext";

interface IndikatorPemda {
    indikator_id: string;
    asal_iku: string;
    is_active: boolean;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    created_at: string; // ISO 8601 string
    tahun_awal: string;
    tahun_akhir: string;
    jenis_periode: string;
    target: {
        target: string;
        satuan: string;
    }
}

const IKU: IndikatorPemda[] = [
    {
        indikator_id: "IND-SAS-PMD-2025-59d0b",
        asal_iku: "Sasaran Pemda",
        is_active: true,
        indikator: "_DUMMY_ Nilai Evaluasi Penyelenggaraan Mal Pelayanan Publik",
        rumus_perhitungan: "Nilai evaluasi penyelenggaraan Mal Pelayanan Publik (MPP) diukur oleh Kementerian Pendayagunaan Aparatur Negara dan Reformasi Birokrasi (PANRB), dan formulasinya didasarkan pada beberapa aspek yang diatur dalam peraturan perundang-undangan. Evaluasi ini bertujuan untuk menilai efektivitas, efisiensi, dan kualitas pelayanan publik yang diberikan melalui MPP",
        sumber_data: "Kemenpan RB",
        created_at: "2025-06-17T08:51:52Z",
        tahun_awal: "",
        tahun_akhir: "",
        jenis_periode: "",
        target: {
            target: "70",
            satuan: "%",
        }
    }
]

const Table = () => {

    const { branding } = useBrandingContext();
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl">
                <table className="w-full">
                    <thead>
                        <tr className="bg-sky-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator Utama</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">2025</th>
                        </tr>
                        <tr className="bg-sky-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            IKU.map((item, index) => (
                                <tr key={item.indikator_id || index}>
                                    <td className="border-x border-b border-sky-500 py-4 px-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border-r border-b border-sky-500 px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            <p>{item.indikator || "-"}</p>
                                            <p className="text-red-500">{item.is_active === false ? "(tidak aktif)" : ""}</p>
                                        </div>
                                        <p className="text-gray-500 text-xs">({item.asal_iku || "-"})</p>
                                    </td>
                                    <td className="border-r border-b border-sky-500 px-6 py-4">
                                        {item.rumus_perhitungan || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-500 px-6 py-4">
                                        {item.sumber_data || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-500 px-6 py-4">
                                        {item.target.target || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-500 px-6 py-4">
                                        {item.target.satuan || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
