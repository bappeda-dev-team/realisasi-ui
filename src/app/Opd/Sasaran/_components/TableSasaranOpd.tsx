import React from 'react'
import RowSasaranComponent from './RowSasaranComponent';
import { SasaranOpdPenetapanGrouped } from '@/types'

interface TableSasaranOpdProps {
    tahun: number;
    sasaranOpd: SasaranOpdPenetapanGrouped[];
    handleOpenPrintPreview: () => void;
}

export default function TableSasaranOpd({ tahun, sasaranOpd, handleOpenPrintPreview }: TableSasaranOpdProps) {

    return (
        <table className="w-full">
            <thead>
                <tr className="text-xm bg-emerald-500 text-white">
                    <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center"><div className="flex flex-col items-center"><span>No</span><span>(1)</span></div></td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center"><div className="flex flex-col items-center"><span>Sasaran</span><span>(2)</span></div></td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]"><div className="flex flex-col items-center"><span>Indikator</span><span>(3)</span></div></td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]"><div className="flex flex-col items-center"><span>Rumus Perhitungan</span><span>(4)</span></div></td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]"><div className="flex flex-col items-center"><span>Sumber Data</span><span>(5)</span></div></td>
                    <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">Realisasi - Sasaran</th>
                    <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[250px] text-center"><div className="flex flex-col items-center"><span>Faktor Penunjang</span><span>(10)</span></div></th>
                    <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[250px] text-center"><div className="flex flex-col items-center"><span>Faktor Penghambat</span><span>(11)</span></div></th>
                    <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[120px] text-center"><div className="flex flex-col items-center"><span>Aksi</span><span>(12)</span></div></th>
                </tr>
                <tr className="bg-emerald-500 text-white">
                    <th className="border-l border-b px-6 py-3 min-w-[50px]"><div className="flex flex-col items-center"><span>Target (%)</span><span>(6)</span></div></th>
                    <th className="border-l border-b px-6 py-3 min-w-[50px]"><div className="flex flex-col items-center"><span>Realisasi (%)</span><span>(7)</span></div></th>
                    <th className="border-l border-b px-6 py-3 min-w-[50px]"><div className="flex flex-col items-center"><span>Capaian (%)</span><span>(8)</span><span>(7/6*100)</span></div></th>
                    <th className="border-l border-b px-6 py-3 min-w-[150px]"><div className="flex flex-col items-center"><span>Keterangan Capaian</span><span>(9)</span></div></th>
                </tr>
            </thead>
            <tbody>
                {sasaranOpd.map((sasOpd, index) => (
                    <RowSasaranComponent
                        key={sasOpd.sasaranId}
                        no={index + 1}
                        sasaranOpd={sasOpd}
                        tahun={tahun}
                        handleOpenPrintPreview={handleOpenPrintPreview}
                    />
                ))}
            </tbody>
        </table>
    )
}
