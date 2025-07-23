import React from 'react';
import RowTujuanComponent from './RowTujuanComponent';
import { TujuanOpd, TujuanOpdTargetRealisasiCapaian } from '@/types';

interface TableTujuanProps {
    periode: number[];
    tujuanOpd: TujuanOpd[];
    targetRealisasiCapaians: TujuanOpdTargetRealisasiCapaian[];
    /* handleOpenModal: (tujuan: TujuanPemda, data: TargetRealisasiCapaian[]) => void; */
}

function TableTujuan({ periode, tujuanOpd, targetRealisasiCapaians }: TableTujuanProps) {

    return (
        <table className="w-full">
            <thead>
                <tr className="text-white bg-red-400">
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center">No</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[400px] text-center">Tujuan</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Indikator</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Rumus Perhitungan</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Sumber Data</th>
                    <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[100px] text-center">Aksi</th>
                    {periode.map((tahun) => (
                        <th key={tahun} colSpan={4} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">
                            {tahun}
                        </th>
                    ))}
                </tr>
                <tr className="text-white bg-red-500">
                    {periode.map(tahun => (
                        <React.Fragment key={tahun}>
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Realisasi</th>
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                            <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Capaian</th>
                        </React.Fragment>
                    ))}
                </tr>
            </thead>
            <tbody>
                {tujuanOpd.map((tuj, index) => (
                    <RowTujuanComponent
                        key={tuj.id_tujuan_opd}
                        no={index + 1}
                        tujuan={tuj}
                        dataTargetRealisasi={targetRealisasiCapaians}
                        periode={periode}
                    />
                )
                )}
            </tbody>
        </table>
    );
};

export default TableTujuan;
