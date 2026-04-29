import React from 'react';
import RowTujuanComponent from './RowTujuanComponent';
import { TargetRealisasiCapaian, TujuanPemda } from '@/types';

interface TableTujuanProps {
    tahun: number;
    bulanLabel?: string;
    tujuansPemda: TujuanPemda[];
    targetRealisasiCapaians: TargetRealisasiCapaian[];
    handleOpenPrintPreview: () => void;
    handleOpenModal: (tujuan: TujuanPemda, data: TargetRealisasiCapaian[]) => void;
}

function TableTujuan({ tahun, bulanLabel, tujuansPemda, targetRealisasiCapaians, handleOpenPrintPreview, handleOpenModal }: TableTujuanProps) {

    return (
        <table className="w-full">
            <thead>
                <tr className="text-white bg-red-400">
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center">No</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[400px] text-center">Tujuan</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Visi/Misi</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Indikator</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Rumus Perhitungan</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Sumber Data</th>
                    <th colSpan={5} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">
                        {tahun} - {bulanLabel}
                    </th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[120px] text-center">Aksi</th>
                </tr>
                <tr className="text-white bg-red-500">
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>
                    <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[150px] text-center">Keterangan Capaian</th>
                </tr>
            </thead>
            <tbody>
                {tujuansPemda.map((tuj, index) => (
                    <RowTujuanComponent
                        key={tuj.id}
                        no={index + 1}
                        tujuan={tuj}
                        dataTargetRealisasi={targetRealisasiCapaians}
                        tahun={tahun}
                        handleOpenPrintPreview={handleOpenPrintPreview}
                        handleOpenModal={handleOpenModal}
                    />
                )
                )}
            </tbody>
        </table>
    );
};

export default TableTujuan;
