import React from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { SasaranOpdPenetapanGrouped } from '@/types'
import { formatPercentageText } from '@/lib/formatPercentageText'
import CapaianKeterangan from '@/components/Global/CapaianKeterangan'

interface RowSasaranOpdComponentProps {
    no: number;
    sasaranOpd: SasaranOpdPenetapanGrouped;
    tahun: number;
    handleOpenPrintPreview: () => void;
}

export default function RowSasaranComponent({ no, sasaranOpd, tahun, handleOpenPrintPreview }: RowSasaranOpdComponentProps) {
    const indikatorList = sasaranOpd.indikator ?? [];

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} sasaranOpd={sasaranOpd} tahun={tahun} handleOpenPrintPreview={handleOpenPrintPreview} />
    }

    const totalRows = indikatorList.reduce((sum, ind) => {
        const targetCount = ind.targets?.length ?? 0;
        return sum + (targetCount > 0 ? targetCount : 1);
    }, 0);

    return (
        <>
            {indikatorList.map((ind, indikatorIndex) => {
                const sortedTargets = [...(ind.targets ?? [])].sort((a, b) => {
                    const aId = Number(a.targetId);
                    const bId = Number(b.targetId);
                    if (!Number.isNaN(aId) && !Number.isNaN(bId)) return aId - bId;
                    return String(a.targetId).localeCompare(String(b.targetId));
                });

                const targetsForRows = sortedTargets.length > 0 ? sortedTargets : [null];
                const rowSpan = targetsForRows.length;
                return targetsForRows.map((target, targetIndex) => (
                    <tr key={`${ind.id || indikatorIndex}-${target?.targetId ?? `empty-${targetIndex}`}-${tahun}`}>
                        {indikatorIndex === 0 && targetIndex === 0 && (
                            <>
                                <td rowSpan={totalRows} className="border-x border-b border-emerald-500 py-4 px-3 text-center">{no}</td>
                                <td rowSpan={totalRows} className="border-x border-b border-emerald-500 py-4 px-3 text-left">{sasaranOpd.sasaranOpd}</td>
                            </>
                        )}

                        {targetIndex === 0 && (
                            <>
                                <td rowSpan={rowSpan} className="border-r border-b border-emerald-500 px-6 py-4 text-left">{ind.indikator || '-'}</td>
                                <td rowSpan={rowSpan} className="border-r border-b border-emerald-500 px-6 py-4 text-left">{ind.rumusPerhitungan || '-'}</td>
                                <td rowSpan={rowSpan} className="border-l border-b border-emerald-500 px-6 py-4 text-left">{ind.sumberData || '-'}</td>
                            </>
                        )}

                        {target ? (
                            <ColTargetSasaranComponent
                                target={target.target}
                                realisasi={target.realisasi}
                                capaian={target.capaian}
                                keteranganCapaian={target.keteranganCapaian}
                                buktiPendukung={target.buktiPendukung}
                                faktorPenunjang={target.faktorPenunjang}
                                faktorPenghambat={target.faktorPenghambat}
                            />
                        ) : (
                            <td className="border border-emerald-500 px-6 py-4 text-center bg-emerald-100" colSpan={6}>
                                Tidak ada target di tahun {tahun}
                            </td>
                        )}

                        {targetIndex === 0 && (
                            <td rowSpan={rowSpan} className="border border-emerald-500 px-6 py-4 text-center">
                                <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                                    Cetak
                                </ButtonGreenBorder>
                            </td>
                        )}
                    </tr>
                ));
            })}

        </>
    )
}


interface EmptyIndikatorSasaran {
    sasaranOpd: SasaranOpdPenetapanGrouped;
    no: number;
    tahun: number;
    handleOpenPrintPreview: () => void;
}

const EmptyIndikatorRow: React.FC<EmptyIndikatorSasaran> = ({ sasaranOpd, no, tahun, handleOpenPrintPreview }) => {
    return (
        <tr key={sasaranOpd.sasaranId}>
            <td className="border-x border-b border-emerald-500 px-6 py-4 text-center">{no}</td>
            <td className="border-x border-b border-emerald-500 px-6 py-4 text-left">{sasaranOpd.sasaranOpd}</td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center text-red-600 font-medium">Data indikator tidak ada / belum di isi</td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <span>-</span>
                    <ButtonGreenBorder className="w-full" disabled onClick={() => {}}>
                        Realisasi
                    </ButtonGreenBorder>
                </div>
            </td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                    <span>-</span>
                </div>
            </td>
            <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-1">
                    <span>-</span>
                </div>
            </td>
            <td className="border-l border-b border-emerald-500 px-6 py-4 text-center">
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
    capaian: string;
    keteranganCapaian: string;
    buktiPendukung?: string | null;
    faktorPenunjang?: string | null;
    faktorPenghambat?: string | null;
};

const formatWithComma = (value: number | string): string => {
        if (value === null || value === undefined || value === 0) return '-';
        return value.toString().replace('.', ',');
    };

const ColTargetSasaranComponent: React.FC<TargetColProps> = ({
    target,
    realisasi,
    capaian,
    keteranganCapaian,
    buktiPendukung,
    faktorPenunjang,
    faktorPenghambat,
}) => {
    return (
        <>
            <td className="border border-emerald-500 px-6 py-4 text-center">{target}</td>
            <td className="border border-emerald-500 px-6 py-4 text-center">
                <span>{formatWithComma(realisasi)}</span>
            </td>
            <td className="border border-emerald-500 px-6 py-4 text-center">{formatPercentageText(capaian)}</td>
            <td className="border border-emerald-500 px-6 py-4"><CapaianKeterangan buktiPendukung={buktiPendukung}>{formatPercentageText(keteranganCapaian || '-')}</CapaianKeterangan></td>
            <td className="border border-emerald-500 px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="whitespace-pre-line">{faktorPenunjang || '-'}</span>
                </div>
            </td>
            <td className="border border-emerald-500 px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="whitespace-pre-line">{faktorPenghambat || '-'}</span>
                </div>
            </td>
        </>
    );
}
