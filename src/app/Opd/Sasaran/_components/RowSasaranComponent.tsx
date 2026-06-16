import React, { useState } from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { SasaranOpdPenetapanGrouped, SasaranOpdTargetRealisasiCapaian } from '@/types'
import { formatPercentageText } from '@/lib/formatPercentageText'
import FormFaktorPenunjangSasaranOpd from "./FormFaktorPenunjangSasaranOpd";
import FormFaktorPenghambatSasaranOpd from "./FormFaktorPenghambatSasaranOpd";

interface RowSasaranOpdComponentProps {
    no: number;
    sasaranOpd: SasaranOpdPenetapanGrouped;
    tahun: number;
    kodeOpd: string;
    bulanKey?: string;
    onFaktorSuccess?: () => void;
    handleOpenPrintPreview: () => void;
}

export default function RowSasaranComponent({ no, sasaranOpd, tahun, kodeOpd, bulanKey, onFaktorSuccess, handleOpenPrintPreview }: RowSasaranOpdComponentProps) {
    const indikatorList = sasaranOpd.indikator ?? [];
    const [faktorTarget, setFaktorTarget] = useState<{
        target: SasaranOpdTargetRealisasiCapaian;
        indikatorId: string;
        jenis: 'penunjang' | 'penghambat';
    } | null>(null);

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
                                <td rowSpan={rowSpan} className="border-r border-b border-emerald-500 px-6 py-4">{ind.indikator || '-'}</td>
                                <td rowSpan={rowSpan} className="border-r border-b border-emerald-500 px-6 py-4">{ind.rumusPerhitungan || '-'}</td>
                                <td rowSpan={rowSpan} className="border-l border-b border-emerald-500 px-6 py-4">{ind.sumberData || '-'}</td>
                            </>
                        )}

                        {target ? (
                            <ColTargetSasaranComponent
                                target={target.target}
                                realisasi={target.realisasi}
                                capaian={target.capaian}
                                keteranganCapaian={target.keteranganCapaian}
                                faktorPenunjang={target.faktorPenunjang}
                                faktorPenghambat={target.faktorPenghambat}
                                isRealisasiFilled={target.realisasi !== null && target.realisasi !== undefined && Number(target.realisasi) !== 0}
                                onEditFaktorPenunjang={() => setFaktorTarget({ target, indikatorId: ind.id, jenis: 'penunjang' })}
                                onEditFaktorPenghambat={() => setFaktorTarget({ target, indikatorId: ind.id, jenis: 'penghambat' })}
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

            {faktorTarget?.jenis === 'penunjang' && (
                <FormModal
                    isOpen={true}
                    onClose={() => setFaktorTarget(null)}
                    title={`Faktor Penunjang - ${faktorTarget.target.indikator}`}
                >
                    <FormFaktorPenunjangSasaranOpd
                        kodeOpd={kodeOpd}
                        kodeSasaranOpd={sasaranOpd.sasaranId}
                        kodeIndikator={faktorTarget.indikatorId}
                        kodeTarget={faktorTarget.target.targetId}
                        tahun={String(tahun)}
                        bulan={bulanKey ?? ''}
                        currentValue={faktorTarget.target.faktorPenunjang ?? ''}
                        onClose={() => setFaktorTarget(null)}
                        onSuccess={() => {
                            setFaktorTarget(null);
                            onFaktorSuccess?.();
                        }}
                    />
                </FormModal>
            )}

            {faktorTarget?.jenis === 'penghambat' && (
                <FormModal
                    isOpen={true}
                    onClose={() => setFaktorTarget(null)}
                    title={`Faktor Penghambat - ${faktorTarget.target.indikator}`}
                >
                    <FormFaktorPenghambatSasaranOpd
                        kodeOpd={kodeOpd}
                        kodeSasaranOpd={sasaranOpd.sasaranId}
                        kodeIndikator={faktorTarget.indikatorId}
                        kodeTarget={faktorTarget.target.targetId}
                        tahun={String(tahun)}
                        bulan={bulanKey ?? ''}
                        currentValue={faktorTarget.target.faktorPenghambat ?? ''}
                        onClose={() => setFaktorTarget(null)}
                        onSuccess={() => {
                            setFaktorTarget(null);
                            onFaktorSuccess?.();
                        }}
                    />
                </FormModal>
            )}
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
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">{sasaranOpd.sasaranOpd}</td>
                <td colSpan={9} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic bg-red-300">
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
    capaian: string;
    keteranganCapaian: string;
    faktorPenunjang?: string | null;
    faktorPenghambat?: string | null;
    isRealisasiFilled: boolean;
    onEditFaktorPenunjang: () => void;
    onEditFaktorPenghambat: () => void;
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
    faktorPenunjang,
    faktorPenghambat,
    isRealisasiFilled,
    onEditFaktorPenunjang,
    onEditFaktorPenghambat,
}) => {
    return (
        <>
            <td className="border border-emerald-500 px-6 py-4 text-center">{target}</td>
            <td className="border border-emerald-500 px-6 py-4 text-center">
                <span>{formatWithComma(realisasi)}</span>
            </td>
            <td className="border border-emerald-500 px-6 py-4 text-center">{formatPercentageText(capaian)}</td>
            <td className="border border-emerald-500 px-6 py-4">{formatPercentageText(keteranganCapaian || '-')}</td>
            <td className="border border-emerald-500 px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                    <span>{faktorPenunjang || '-'}</span>
                    <ButtonGreenBorder
                        className="w-full text-xs py-0.5"
                        onClick={onEditFaktorPenunjang}
                        disabled={!isRealisasiFilled}
                    >
                        Faktor
                    </ButtonGreenBorder>
                </div>
            </td>
            <td className="border border-emerald-500 px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                    <span>{faktorPenghambat || '-'}</span>
                    <ButtonGreenBorder
                        className="w-full text-xs py-0.5"
                        onClick={onEditFaktorPenghambat}
                        disabled={!isRealisasiFilled}
                    >
                        Faktor
                    </ButtonGreenBorder>
                </div>
            </td>
        </>
    );
}
