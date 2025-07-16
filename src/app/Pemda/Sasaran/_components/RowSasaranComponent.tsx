import React from 'react'
/* import { ButtonGreenBorder } from "@/components/Global/Button/button"; */
/* import ColTargetTujuanComponent from './ColTargetTujuanComponent'; */
import { SasaranPemda, TargetRealisasiCapaian } from '@/types'

interface RowTujuanComponentProps {
    no: number;
    sasaran: SasaranPemda;
    targetRealisasiCapaian: TargetRealisasiCapaian[];
    tahun: number;
}

const RowSasaranComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    sasaran,
    targetRealisasiCapaian,
    tahun,
}) => {
    const indikator = sasaran.indikator?.[0];
    const targetData = targetRealisasiCapaian.find(r => r.indikatorId === indikator.id.toString() && r.tahun === tahun.toString());

    return (
        <tr>
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{sasaran.sasaran_pemda}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.indikator ?? '-'}</td>
            <td className="border border-red-400 px-6 py-4 text-center">
                <div className="flex flex-col gap-2">
                </div>
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.rumus_perhitungan ?? '-'}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{indikator?.sumber_data ?? '-'}</td>
            {
                targetData ? (
                    <React.Fragment>
                        <td className="border border-red-400 px-6 py-4 text-center">{targetData.target}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{targetData.realisasi}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{targetData.satuan}</td>
                        <td className="border border-red-400 px-6 py-4 text-center">{targetData.capaian}</td>
                    </React.Fragment>
                ) :
                    (
                        <React.Fragment key={`${sasaran.id_sasaran_pemda}-${tahun}`}>
                            <td className="border border-red-400 px-6 py-4 text-center" colSpan={4}></td>
                        </React.Fragment>
                    )
            }
            <td className="border-b border-red-400 px-6 py-4 text-center">Keterangan Realisasi</td>
        </tr>
    );
}

export default RowSasaranComponent;
