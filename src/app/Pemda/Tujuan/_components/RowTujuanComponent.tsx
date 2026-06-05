import React, { useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import ColTargetTujuanComponent from "./ColTargetTujuanComponent";
import { TargetRealisasiCapaian, TujuanPemdaRealisasiGrouped } from "@/types";
import FormFaktorPenunjang from "./FormFaktorPenunjang";
import FormFaktorPenghambat from "./FormFaktorPenghambat";
import { getMonthKey } from "@/lib/months";

interface RowTujuanComponentProps {
    no: number;
    tujuan: TujuanPemdaRealisasiGrouped;
    tahun: number;
    canEdit: boolean;
    handleOpenPrintPreview: () => void;
    handleOpenModal: (dataTargetRealisasi: TargetRealisasiCapaian[]) => void;
    bulanKey?: string;
    onFaktorSuccess?: () => void;
}

const RowTujuanComponent: React.FC<RowTujuanComponentProps> = ({
    no,
    tujuan,
    tahun,
    canEdit,
    handleOpenPrintPreview,
    handleOpenModal,
    bulanKey,
    onFaktorSuccess,
}) => {
    const indikatorList = tujuan.indikator ?? [];
    const [faktorTarget, setFaktorTarget] = useState<{
        target: TargetRealisasiCapaian;
        indikatorId: string;
        jenis: 'penunjang' | 'penghambat';
    } | null>(null);

    if (indikatorList.length === 0) {
        return <EmptyIndikatorRow no={no} tujuan={tujuan} tahun={tahun} handleOpenPrintPreview={handleOpenPrintPreview} />;
    }

    const detailRows = indikatorList.flatMap((indikator) => {
        if (!indikator.targets.length) {
            return [{ indikator, target: null as TargetRealisasiCapaian | null }];
        }

        return indikator.targets.map((target) => ({ indikator, target }));
    });

    return (
        <>
            {detailRows.map(({ indikator, target }, index) => (
                <tr key={`${tujuan.tujuanId}-${indikator.id}-${target?.targetId ?? index}`}>
                    {index === 0 && (
                        <>
                            <td rowSpan={detailRows.length} className="border border-red-400 px-6 py-4 text-center">{no}</td>
                            <td rowSpan={detailRows.length} className="border border-red-400 px-6 py-4 text-center">{tujuan.tujuanPemda}</td>
                            <td rowSpan={detailRows.length} className="border border-red-400 px-6 py-4 text-center">{tujuan.visiMisi || "-"}</td>
                        </>
                    )}
                    <td className="border border-red-400 px-6 py-4 text-center">{indikator.indikator ?? "-"}</td>
                    <td className="border border-red-400 px-6 py-4 text-center">{indikator.rumusPerhitungan || "-"}</td>
                    <td className="border border-red-400 px-6 py-4 text-center">{indikator.sumberData || "-"}</td>
                    {target ? (
                        <ColTargetTujuanComponent
                            target={target.target}
                            satuan={target.satuan}
                            realisasi={String(target.realisasi ?? 0)}
                            capaian={target.capaian}
                            keteranganCapaian={target.keteranganCapaian}
                            faktorPenunjang={target.faktorPenunjang}
                            faktorPenghambat={target.faktorPenghambat}
                            canEdit={canEdit}
                            handleClick={canEdit ? () => handleOpenModal([target]) : undefined}
                            onEditFaktorPenunjang={canEdit ? () => setFaktorTarget({ target, indikatorId: indikator.id, jenis: 'penunjang' }) : undefined}
                            onEditFaktorPenghambat={canEdit ? () => setFaktorTarget({ target, indikatorId: indikator.id, jenis: 'penghambat' }) : undefined}
                        />
                    ) : (
                        <td className="border border-red-400 px-6 py-4 text-center" colSpan={6}>
                            Tidak ada target
                        </td>
                    )}
                    {index === 0 && (
                        <td rowSpan={detailRows.length} className="border border-red-400 px-6 py-4 text-center">
                            <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                                Cetak
                            </ButtonGreenBorder>
                        </td>
                    )}
                </tr>
            ))}

            {faktorTarget?.jenis === 'penunjang' && (
                <FormModal
                    isOpen={true}
                    onClose={() => setFaktorTarget(null)}
                    title={`Faktor Penunjang - ${faktorTarget.target.indikator}`}
                >
                    <FormFaktorPenunjang
                        tujuanId={tujuan.tujuanId}
                        indikatorId={faktorTarget.indikatorId}
                        targetId={faktorTarget.target.targetId}
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
                    <FormFaktorPenghambat
                        tujuanId={tujuan.tujuanId}
                        indikatorId={faktorTarget.indikatorId}
                        targetId={faktorTarget.target.targetId}
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
    );
};

export default RowTujuanComponent;

const EmptyIndikatorRow: React.FC<{
    tujuan: any;
    no: number;
    tahun: number;
    handleOpenPrintPreview: () => void;
}> = ({ tujuan, no, tahun, handleOpenPrintPreview }) => {
    return (
        <tr key={tujuan.tujuanId} className="bg-red-300">
            <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
            <td className="border border-red-400 px-6 py-4 text-center">
                {tujuan.tujuanPemda}
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">{tujuan.visiMisi || "-"}</td>
            <td
                colSpan={9}
                className="border border-red-400 px-6 py-4 text-center text-gray-500 italic"
              >
                Tidak ada indikator dan target tahun {tahun}
            </td>
            <td className="border border-red-400 px-6 py-4 text-center">
                <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                    Cetak
                </ButtonGreenBorder>
            </td>
        </tr>
    );
};
