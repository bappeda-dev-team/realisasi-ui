import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { SasaranOpdPerencanaan, SasaranOpdTargetRealisasiCapaian } from '@/types'

interface RowSasaranOpdComponentProps {
    no: number;
    sasaranOpd: SasaranOpdPerencanaan;
    dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[];
    tahun: number;
    handleOpenModal: (sasaran: SasaranOpdPerencanaan, dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[]) => void;
}

export default function RowSasaranComponent({ no, sasaranOpd, dataTargetRealisasi, tahun, handleOpenModal }: RowSasaranOpdComponentProps) {
    const indikatorList = sasaranOpd.indikator ?? [];

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} sasaranOpd={sasaranOpd} tahun={tahun} />
    }

    return (
        <>
            {indikatorList.map((ind, index) => {
                const targetList = dataTargetRealisasi.filter(r => r.indikatorId === ind.id.toString() && r.tahun === tahun.toString())
                return (
                    <tr key={ind.id || index}>
                        {index === 0 && (
                            <>
                                <td rowSpan={indikatorList.length} className="border-x border-b border-emerald-500 py-4 px-3 text-center">{no}</td>
                                <td rowSpan={indikatorList.length} className="border-x border-b border-emerald-500 py-4 px-3 text-left">{sasaranOpd.nama_sasaran_opd}</td>
                            </>
                        )}
                        <td className="border-r border-b border-emerald-500 px-6 py-4">{ind.indikator || '-'}</td>
                        <td className="border-r border-b border-emerald-500 px-6 py-4">{ind.rumus_perhitungan || '-'}</td>
                        <td className="border-l border-b border-emerald-500 px-6 py-4">{ind.sumber_data || '-'}</td>
                        {targetList.length > 0 ? (
                            <React.Fragment key={`${ind.id || index}-target-${tahun}`}>
                                <td className="border border-emerald-500 px-6 py-4 text-center">
                                    <div className="flex flex-col gap-2">
                                        <ButtonGreenBorder
                                            className="flex items-center gap-1 cursor-pointer"
                                            onClick={() => {
                                                handleOpenModal(sasaranOpd, dataTargetRealisasi);
                                            }} >
                                            Realisasi
                                        </ButtonGreenBorder>
                                    </div>
                                </td>
                                {targetList.map((target, idx) => (
                                    <ColTargetSasaranComponent
                                        key={target.targetRealisasiId || idx}
                                        target={target.target}
                                        realisasi={target.realisasi}
                                        satuan={target.satuan}
                                        capaian={target.capaian}
                                    />
                                ))}
                            </React.Fragment>
                        )
                            :
                            (
                                <React.Fragment key={`${ind.id || index}-target-${tahun}`}>
                                    <td className="border border-red-400 px-6 py-4 text-center bg-red-300" colSpan={5}>
                                        Tidak ada target di tahun {tahun}
                                    </td>
                                </React.Fragment>
                            )}
                    </tr>
                )
            })}
        </>
    )
}


interface EmptyIndikatorSasaran {
    sasaranOpd: SasaranOpdPerencanaan;
    no: number;
    tahun: number;
}

const EmptyIndikatorRow: React.FC<EmptyIndikatorSasaran> = ({ sasaranOpd, no, tahun }) => {
    return (
        <tr key={sasaranOpd.id}>
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{sasaranOpd.nama_sasaran_opd}</td>
            <td colSpan={8} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic bg-red-300">
                Tidak ada indikator dan target tahun {tahun}
            </td>
        </tr>
    )
}

type TargetColProps = {
    target: string;
    realisasi: number;
    satuan: string;
    capaian: string;
};

const ColTargetSasaranComponent: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian }) => {

    return (
        <>
            <td className="border border-emerald-500 px-6 py-4 text-center">{target}</td>
            <td className="border border-emerald-500 px-6 py-4 text-center">{realisasi}</td>
            <td className="border border-emerald-500 px-6 py-4 text-center">{satuan}</td>
            <td className="border border-emerald-500 px-6 py-4 text-center">{capaian}</td>
        </>
    );
}
