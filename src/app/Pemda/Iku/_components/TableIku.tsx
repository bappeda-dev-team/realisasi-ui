import React from 'react';
import { IkuPemda } from '@/types'
import RowIkuComponent from './RowIkuComponent';

interface TableIkuProps {
    tahun: number;
    ikuPemda: IkuPemda[];
}

export default function TableIku({ tahun, ikuPemda }: TableIkuProps) {
    return (
        <table className="w-full">
            <thead>
                <tr className="bg-sky-500 text-white">
                    <th rowSpan={2} className="border-r border-b px-6 py-3 text-center">No</th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">IKU</th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Asal IKU</th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Rumus Perhitungan</th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Sumber Data</th>
                    <th key={tahun} colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">
                        {tahun}
                    </th>
                </tr>
                <tr className="text-white bg-sky-500">
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>
                </tr>
            </thead>
            <tbody>
                {ikuPemda.map((iku, index) => (
                    <RowIkuComponent
                        key={iku.indikator_id}
                        no={index + 1}
                        ikuPemda={iku}
                        tahun={tahun}
                    />
                ))}
            </tbody>
        </table>
    )
}
