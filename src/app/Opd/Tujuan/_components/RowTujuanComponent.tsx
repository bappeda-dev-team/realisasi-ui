import React, { useState } from 'react'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { TujuanOpdRealisasiGrouped, TujuanOpdTargetRealisasiCapaian } from '@/types';
import { formatPercentageText } from '@/lib/formatPercentageText';
import FormFaktorPenunjang from './FormFaktorPenunjang';
import FormFaktorPenghambat from './FormFaktorPenghambat';

interface RowTujuanComponentProps {
    no: number;
    tujuan: TujuanOpdRealisasiGrouped;
    tahun: string;
    kodeOpd: string;
    handleOpenPrintPreview: () => void;
    onOpenRealisasi?: (targetInfo: {
        kodeTujuanOpd: string;
        kodeIndikator: string;
        kodeTarget: string;
        tujuanOpd: string;
        indikator: string;
        target: string;
        realisasi: number | null;
        satuan: string;
        rumusPerhitungan: string;
        sumberData: string;
    }) => void;
    bulanKey?: string;
    onFaktorSuccess?: () => void;
}

const RowTujuanComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    tujuan,
    tahun,
    kodeOpd,
    handleOpenPrintPreview,
    onOpenRealisasi,
    bulanKey,
    onFaktorSuccess,
}) => {
    const indikatorList = tujuan.indikator ?? [];
    const [faktorTarget, setFaktorTarget] = useState<{
        target: TujuanOpdTargetRealisasiCapaian;
        jenis: 'penunjang' | 'penghambat';
    } | null>(null);

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} tujuan={tujuan} tahun={tahun} handleOpenPrintPreview={handleOpenPrintPreview} />
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
                return targetsForRows.map((target, targetIndex) => (
                    <tr key={`${ind.id || indikatorIndex}-${target?.targetId ?? `empty-${targetIndex}`}-${tahun}`}>
                        {indikatorIndex === 0 && targetIndex === 0 && (
                            <>
                                <td rowSpan={totalRows} className="border border-red-400 px-6 py-4 text-center">{no}</td>
                                <td rowSpan={totalRows} className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuanOpd}</td>
                            </>
                        )}

                        {targetIndex === 0 && (
                            <>
                                <td rowSpan={targetsForRows.length} className="border border-red-400 px-6 py-4 text-center">{ind?.indikator || '-'}</td>
                                <td rowSpan={targetsForRows.length} className="border border-red-400 px-6 py-4 text-center">{ind?.rumusPerhitungan || '-'}</td>
                                <td rowSpan={targetsForRows.length} className="border border-red-400 px-6 py-4 text-center">{ind?.sumberData || '-'}</td>
                            </>
                        )}

                        {target ? (
                            <ColTargetTujuanComponent
                                target={target.target}
                                realisasi={target.realisasi}
                                capaian={target.capaian}
                                keteranganCapaian={target.keteranganCapaian}
                                faktorPenunjang={target.faktorPenunjang}
                                faktorPenghambat={target.faktorPenghambat}
                                canEditRealisasi={!!onOpenRealisasi}
                                handleClick={onOpenRealisasi ? () => onOpenRealisasi({
                                    kodeTujuanOpd: tujuan.tujuanId,
                                    kodeIndikator: ind.id,
                                    kodeTarget: target.targetId,
                                    tujuanOpd: tujuan.tujuanOpd,
                                    indikator: ind.indikator,
                                    target: target.target,
                                    realisasi: target.realisasi,
                                    satuan: target.satuan,
                                    rumusPerhitungan: ind.rumusPerhitungan,
                                    sumberData: ind.sumberData,
                                }) : undefined}
                                onEditFaktorPenunjang={onOpenRealisasi ? () => setFaktorTarget({ target, jenis: 'penunjang' }) : undefined}
                                onEditFaktorPenghambat={onOpenRealisasi ? () => setFaktorTarget({ target, jenis: 'penghambat' }) : undefined}
                            />
                        ) : (
                            <td className="border border-red-400 px-6 py-4 text-center" colSpan={6}>
                                Tidak ada target
                            </td>
                        )}

                        <td className="border border-red-400 px-6 py-4 text-center">
                            <ButtonGreenBorder className="w-full text-xs" onClick={handleOpenPrintPreview}>
                                Cetak
                            </ButtonGreenBorder>
                        </td>
                    </tr>
                ));
            })}

            {faktorTarget?.jenis === 'penunjang' && (
                <FormModal
                    isOpen={true}
                    onClose={() => setFaktorTarget(null)}
                    title={`Faktor Penunjang`}
                >
                    <FormFaktorPenunjang
                        kodeOpd={kodeOpd}
                        kodeTujuanOpd={tujuan.tujuanId}
                        kodeIndikator={faktorTarget.target.indikatorId}
                        kodeTarget={faktorTarget.target.targetId}
                        tahun={tahun}
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
                    title={`Faktor Penghambat`}
                >
                    <FormFaktorPenghambat
                        kodeOpd={kodeOpd}
                        kodeTujuanOpd={tujuan.tujuanId}
                        kodeIndikator={faktorTarget.target.indikatorId}
                        kodeTarget={faktorTarget.target.targetId}
                        tahun={tahun}
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
    );
}

export default RowTujuanComponent;

const EmptyIndikatorRow: React.FC<{
    tujuan: TujuanOpdRealisasiGrouped;
    no: number;
    tahun: string;
    handleOpenPrintPreview: () => void;
}> = ({
    tujuan,
    no,
    tahun,
    handleOpenPrintPreview,
}) => {
        return (
            <tr key={tujuan.tujuanId}>
                <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuanOpd}</td>
                <td colSpan={9} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic bg-red-300">
                    Tidak ada indikator dan target tahun {tahun}
                </td>
                <td className="border border-red-400 px-6 py-4 text-center">
                    <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                        Cetak
                    </ButtonGreenBorder>
                </td>
            </tr>
        )
    }


type TargetColProps = {
    target: string;
    realisasi: number | null;
    capaian: string;
    keteranganCapaian: string;
    faktorPenunjang?: string | null;
    faktorPenghambat?: string | null;
    canEditRealisasi?: boolean;
    handleClick?: () => void;
    onEditFaktorPenunjang?: () => void;
    onEditFaktorPenghambat?: () => void;
};

const ColTargetTujuanComponent: React.FC<TargetColProps> = ({ target, realisasi, capaian, keteranganCapaian, faktorPenunjang, faktorPenghambat, canEditRealisasi, handleClick, onEditFaktorPenunjang, onEditFaktorPenghambat }) => {
    const isRealisasiFilled = realisasi != null && realisasi !== 0;

    return (
        <>
            <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
            <td className="border border-red-400 px-6 py-4 text-center">
                <div className="flex flex-col items-center gap-2">
                    <span>{realisasi ?? 0}</span>
                    {canEditRealisasi && handleClick && (
                        <ButtonGreenBorder
                            className="w-full"
                            onClick={handleClick}
                        >
                            Realisasi
                        </ButtonGreenBorder>
                    )}
                </div>
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">{formatPercentageText(capaian)}</td>
            <td className="border border-red-400 px-6 py-4">{formatPercentageText(keteranganCapaian || '-')}</td>
            <td className="border border-red-400 px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                    <span>{faktorPenunjang || '-'}</span>
                    {canEditRealisasi && onEditFaktorPenunjang && (
                        <ButtonGreenBorder
                            className="w-full text-xs py-0.5"
                            onClick={isRealisasiFilled ? onEditFaktorPenunjang : undefined}
                            disabled={!isRealisasiFilled}
                        >
                            Faktor
                        </ButtonGreenBorder>
                    )}
                </div>
            </td>
            <td className="border border-red-400 px-6 py-4">
                <div className="flex flex-col items-center gap-1">
                    <span>{faktorPenghambat || '-'}</span>
                    {canEditRealisasi && onEditFaktorPenghambat && (
                        <ButtonGreenBorder
                            className="w-full text-xs py-0.5"
                            onClick={isRealisasiFilled ? onEditFaktorPenghambat : undefined}
                            disabled={!isRealisasiFilled}
                        >
                            Faktor
                        </ButtonGreenBorder>
                    )}
                </div>
            </td>
        </>
    );
}
