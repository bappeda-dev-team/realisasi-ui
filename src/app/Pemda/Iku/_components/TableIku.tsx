import React from 'react';
import { IkuPemda, IkuPemdaTargetRealisasiCapaian } from '@/types'
import RowIkuComponent from './RowIkuComponent';

interface TableIkuProps {
    tahun: number;
    ikuPemda: IkuPemda[];
    targetRealisasiCapaian: IkuPemdaTargetRealisasiCapaian[];
    handleOpenPrintPreview: () => void;
}

export default function TableIku({ tahun, ikuPemda, targetRealisasiCapaian, handleOpenPrintPreview }: TableIkuProps) {
    return (
        <table className="w-full">
            <thead>
                <tr className="bg-sky-500 text-white">
                    <th rowSpan={2} className="border-r border-b px-6 py-3 text-center"><div className="flex flex-col items-center"><span>No</span><span>(1)</span></div></th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]"><div className="flex flex-col items-center"><span>IKU</span><span>(2)</span></div></th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]"><div className="flex flex-col items-center"><span>Asal IKU</span><span>(3)</span></div></th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]"><div className="flex flex-col items-center"><span>Rumus Perhitungan</span><span>(4)</span></div></th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]"><div className="flex flex-col items-center"><span>Sumber Data</span><span>(5)</span></div></th>
                    <th key={tahun} colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">
                        {tahun}
                    </th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px] text-center"><div className="flex flex-col items-center"><span>Faktor Penunjang</span><span>(10)</span></div></th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px] text-center"><div className="flex flex-col items-center"><span>Faktor Penghambat</span><span>(11)</span></div></th>
                    <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[120px] text-center"><div className="flex flex-col items-center"><span>Aksi</span><span>(12)</span></div></th>
                </tr>
                <tr className="text-white bg-sky-500">
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center"><div className="flex flex-col items-center"><span>Target (%)</span><span>(6)</span></div></th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center"><div className="flex flex-col items-center"><span>Realisasi (%)</span><span>(7)</span></div></th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center"><div className="flex flex-col items-center"><span>Capaian (%)</span><span>(8)</span><span>(7/6*100)</span></div></th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[150px] text-center"><div className="flex flex-col items-center"><span>Keterangan Capaian</span><span>(9)</span></div></th>
                </tr>
            </thead>
            <tbody>
                {ikuPemda.map((iku, index) => (
                    <RowIkuComponent
                        key={iku.indikator_id}
                        no={index + 1}
                        ikuPemda={iku}
                        tahun={tahun}
                        dataTargetRealisasi={targetRealisasiCapaian}
                        handleOpenPrintPreview={handleOpenPrintPreview}
                    />
                ))}
            </tbody>
        </table>
    )
}
