import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { SasaranOpdPerencanaan, SasaranOpdTargetRealisasiCapaian } from '@/types'

interface RowSasaranOpdComponentProps {
    no: number;
    sasaranOpd: SasaranOpdPerencanaan;
    dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[];
    tahun: number;
    handleOpenPrintPreview: () => void;
    handleOpenModal: (sasaran: SasaranOpdPerencanaan, dataTargetRealisasi: SasaranOpdTargetRealisasiCapaian[], indikatorId: string) => void;
}

export default function RowSasaranComponent({ no, sasaranOpd, dataTargetRealisasi, tahun, handleOpenPrintPreview, handleOpenModal }: RowSasaranOpdComponentProps) {
    const indikatorList = sasaranOpd.indikator ?? [];

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} sasaranOpd={sasaranOpd} tahun={tahun} handleOpenPrintPreview={handleOpenPrintPreview} />
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
                                {targetList.map((target, idx) => (
                                    <ColTargetSasaranComponent
                                        key={target.targetRealisasiId || idx}
                                        target={target.target}
                                        realisasi={target.realisasi}
                                        satuan={target.satuan}
                                        capaian={target.capaian}
                                        keteranganCapaian={target.keteranganCapaian}
                                        handleClick={() => {
                                            handleOpenModal(sasaranOpd, dataTargetRealisasi, ind.id.toString());
                                        }}
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
                        <td className="border border-emerald-500 px-6 py-4 text-center">
                            <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                                Cetak
                            </ButtonGreenBorder>
                        </td>
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
    handleOpenPrintPreview: () => void;
}

const EmptyIndikatorRow: React.FC<EmptyIndikatorSasaran> = ({ sasaranOpd, no, tahun, handleOpenPrintPreview }) => {
    return (
        <tr key={sasaranOpd.id}>
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{sasaranOpd.nama_sasaran_opd}</td>
            <td colSpan={8} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic bg-red-300">
                Tidak ada indikator dan target tahun {tahun}
            </td>
            <td className="border border-emerald-500 px-6 py-4 text-center">
                <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                    Cetak
                </ButtonGreenBorder>
            </td>
        </tr>
    )
}

type TargetColProps = {
    target: string;
    realisasi: number;
    satuan: string;
    capaian: string;
    keteranganCapaian: string;
    handleClick?: () => void;
};

const formatWithComma = (value: number | string): string => {
        if (value === null || value === undefined || value === 0) return '-';
        return value.toString().replace('.', ',');
    };

const ColTargetSasaranComponent: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian, keteranganCapaian, handleClick }) => {

    return (
        <>
            <td className="border border-emerald-500 px-6 py-4 text-center">{target}</td>
            <td className="border border-emerald-500 px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <span>{formatWithComma(realisasi)}</span>
                    {handleClick && (
                        <ButtonGreenBorder
                            className="w-full"
                            onClick={handleClick}
                        >
                            Realisasi
                        </ButtonGreenBorder>
                    )}
                </div>
            </td>
            <td className="border border-emerald-500 px-6 py-4 text-center">{satuan}</td>
            <td className="border border-emerald-500 px-6 py-4 text-center">{capaian}</td>
            <td className="border border-emerald-500 px-6 py-4">{keteranganCapaian || '-'}</td>
        </>
    );
}
