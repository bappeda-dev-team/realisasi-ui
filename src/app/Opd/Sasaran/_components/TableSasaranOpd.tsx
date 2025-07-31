import React from 'react'
import RowSasaranComponent from './RowSasaranComponent';
import { SasaranOpdPerencanaan, SasaranOpdTargetRealisasiCapaian } from '@/types'


interface TableSasaranOpdProps {
    tahun: number;
    sasaranOpd: SasaranOpdPerencanaan[];
    targetRealisasiCapaians: SasaranOpdTargetRealisasiCapaian[];
    handleOpenModal: (sasaran: SasaranOpdPerencanaan, dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[]) => void;
}

export default function TableSasaranOpd({ tahun, sasaranOpd, targetRealisasiCapaians, handleOpenModal }: TableSasaranOpdProps) {

    return (
        <table className="w-full">
            <thead>
                <tr className="text-xm bg-emerald-500 text-white">
                    <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Sasaran OPD</td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Indikator</td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</td>
                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</td>
                    <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">{tahun}</th>
                </tr>
                <tr className="bg-emerald-500 text-white">
                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
                    <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian</th>
                </tr>
            </thead>
            <tbody>
                {sasaranOpd.map((sasOpd, index) => (
                    <RowSasaranComponent
                        key={sasOpd.id}
                        no={index + 1}
                        sasaranOpd={sasOpd}
                        dataTargetRealisasi={targetRealisasiCapaians}
                        tahun={tahun}
                        handleOpenModal={handleOpenModal}
                    />
                ))}
            </tbody>
        </table>
    )
}
