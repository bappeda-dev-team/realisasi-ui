import React from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { formatPercentageText } from "@/lib/formatPercentageText";
import { SasaranIndividuRealisasiGrouped } from "@/types";

interface RowSasaranIndividuProps {
    no: number;
    sasaranIndividu: SasaranIndividuRealisasiGrouped;
    tahun: string;
    canEdit: boolean;
    handleOpenPrintPreview: () => void;
    handleOpenModal: (renjaId: string) => void;
}

const formatWithComma = (value: number | string): string => {
    if (value === null || value === undefined || value === 0) return "-";
    return String(value).replace(".", ",");
};

export default function RowSasaranIndividu({
    no,
    sasaranIndividu,
    tahun,
    canEdit,
    handleOpenPrintPreview,
    handleOpenModal,
}: RowSasaranIndividuProps) {
    const indikatorList = sasaranIndividu.indikator ?? [];

    if (!indikatorList.length) {
        return (
            <tr key={sasaranIndividu.renjaId}>
                <td className="border border-red-400 px-6 py-4 text-center">{no}</td>
                <td className="border border-red-400 px-6 py-4 text-center">{sasaranIndividu.nama_pegawai} ({sasaranIndividu.nip})</td>
                <td className="border border-red-400 px-6 py-4 text-center">{sasaranIndividu.renja}</td>
                <td colSpan={7} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic bg-red-300">
                    Tidak ada indikator dan target tahun {tahun}
                </td>
                <td className="border border-emerald-500 px-6 py-4 text-center">
                    <ButtonGreenBorder className="w-full" onClick={handleOpenPrintPreview}>
                        Cetak
                    </ButtonGreenBorder>
                </td>
            </tr>
        );
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
                                <td rowSpan={totalRows} className="border-x border-b border-emerald-500 py-4 px-3 text-left">{sasaranIndividu.nama_pegawai} ({sasaranIndividu.nip})</td>
                                <td rowSpan={totalRows} className="border-x border-b border-emerald-500 py-4 px-3 text-left">{sasaranIndividu.renja}</td>
                            </>
                        )}

                        {targetIndex === 0 && (
                            <>
                                <td rowSpan={rowSpan} className="border-r border-b border-emerald-500 px-6 py-4">{ind.indikator || "-"}</td>
                                <td rowSpan={rowSpan} className="border-r border-b border-emerald-500 px-6 py-4">{ind.rumusPerhitungan || "-"}</td>
                                <td rowSpan={rowSpan} className="border-l border-b border-emerald-500 px-6 py-4">{ind.sumberData || "-"}</td>
                            </>
                        )}

                        {target ? (
                            <>
                                <td className="border border-emerald-500 px-6 py-4 text-center">{target.target}</td>
                                <td className="border border-emerald-500 px-6 py-4 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                        <span>{formatWithComma(target.realisasi)}</span>
                                        {canEdit && (
                                            <ButtonGreenBorder
                                                className="w-full"
                                                onClick={() => handleOpenModal(sasaranIndividu.renjaId)}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        )}
                                    </div>
                                </td>
                                <td className="border border-emerald-500 px-6 py-4 text-center">{formatPercentageText(target.capaian)}</td>
                                <td className="border border-emerald-500 px-6 py-4">{formatPercentageText(target.keteranganCapaian || "-")}</td>
                            </>
                        ) : (
                            <td className="border border-red-400 px-6 py-4 text-center bg-red-300" colSpan={4}>
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
    );
}
