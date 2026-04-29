'use client'

import React, { useEffect, useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { useFetchData } from "@/hooks/useFetchData";
import { getMonthName } from "@/lib/months";
import { RenjaTargetOpdResponse, RenjaPaguOpdResponse } from "@/types";
import FormRealisasiRenjaTargetOpd from "./_components/FormRealisasiRenjaTargetOpd";
import FormRealisasiRenjaPaguOpd from "./_components/FormRealisasiRenjaPaguOpd";

interface RenjaRow {
    id: number;
    renja: string;
    kodeOpd: string;
    kodeRenja: string;
    jenisRenja: string;
    indikator: string;
    targets: {
        targetRealisasiId: number | null;
        renjaId: string;
        renja: string;
        kodeRenja: string;
        jenisRenja: string;
        indikatorId: string;
        indikator: string;
        target: string;
        realisasi: number;
        satuan: string;
        tahun: string;
        jenisRealisasi: string;
        capaian: string;
        keteranganCapaian: string;
        pagu: number | null;
        realistasiPagu: number | null;
        satuanPagu: string;
        capaianPagu: string;
        keteranganCapaianPagu: string;
        renjaPaguId: string | null;
    }[];
}

const Table = () => {
    const [rows, setRows] = useState<RenjaRow[]>([]);
    const [selectedRow, setSelectedRow] = useState<RenjaRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'target' | 'pagu'>('target');
    const { url } = useApiUrlContext();

    const { activatedDinas: kodeOpd, activatedTahun, activatedBulan } = useFilterContext();

    const bulanName = getMonthName(activatedBulan);

    const apiUrlTarget = kodeOpd && activatedTahun && bulanName
        ? `${url}/api/v1/realisasi/renja_target/kodeOpd/${kodeOpd}/tahun/${activatedTahun}/bulan/${encodeURIComponent(bulanName)}`
        : null;

    const apiUrlPagu = kodeOpd && activatedTahun && bulanName
        ? `${url}/api/v1/realisasi/renja_pagu/kodeOpd/${kodeOpd}/tahun/${activatedTahun}/bulan/${encodeURIComponent(bulanName)}`
        : null;

    const { data, loading, error, refetch } = useFetchData<RenjaTargetOpdResponse[]>({ url: apiUrlTarget });

    const { data: paguResponse, loading: loadingPagu, error: errorPagu, refetch: refetchPagu } = useFetchData<RenjaPaguOpdResponse[]>({ url: apiUrlPagu });

    useEffect(() => {
        if (!activatedTahun || !bulanName) {
            setRows([]);
            return;
        }

        if (!data) {
            setRows([]);
            return;
        }

        const paguMap = new Map(paguResponse?.map(p => [p.kodeRenja, p]) || new Map());

        setRows(
            data.map((item) => {
                const paguItem = paguMap.get(item.kodeRenja);
                return {
                    id: item.id,
                    renja: item.renjaTarget ?? "-",
                    kodeOpd: item.kodeOpd ?? kodeOpd ?? "-",
                    kodeRenja: item.kodeRenja ?? "-",
                    jenisRenja: item.jenisRenjaTarget ?? "-",
                    indikator: item.indikator ?? "-",
                    targets: [{
                        targetRealisasiId: item.id ?? null,
                        renjaId: item.renjaTargetId,
                        renja: item.renjaTarget ?? "-",
                        kodeRenja: item.kodeRenja ?? "-",
                        jenisRenja: item.jenisRenjaTarget ?? "-",
                        indikatorId: item.indikatorId,
                        indikator: item.indikator ?? "-",
target: item.target ?? "-",
                        realisasi: item.realisasi,
                        satuan: item.satuan ?? "-",
                        tahun: item.tahun ?? activatedTahun,
                        jenisRealisasi: item.jenisRealisasi,
                        capaian: item.capaian ?? "-",
                        keteranganCapaian: item.keteranganCapaian ?? "-",
                        pagu: paguItem?.pagu ?? null,
                        realistasiPagu: paguItem?.realisasi ?? null,
                        satuanPagu: paguItem?.satuan ?? "-",
                        capaianPagu: paguItem?.capaian ?? "-",
                        keteranganCapaianPagu: paguItem?.keteranganCapaian ?? "-",
                        renjaPaguId: paguItem?.renjaPaguId ?? null,
                    }],
                };
            })
        );
    }, [data, paguResponse, kodeOpd, activatedTahun, bulanName]);

    const handleSuccess = () => {
        refetch();
        refetchPagu();
    };

    const openModal = (row: RenjaRow, type: 'target' | 'pagu' = 'target') => {
        setSelectedRow(row);
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
        setModalType('target');
    };

    const handleRealisasiSuccess = (updatedTargets: RenjaRow['targets']) => {
        if (!selectedRow) return;
        setRows((previous) =>
            previous.map((row) =>
                row.id === selectedRow.id ? { ...row, targets: updatedTargets } : row
            )
        );
        setIsModalOpen(false);
        setSelectedRow(null);
        refetch();
        refetchPagu();
    };

    const infoMessage = !kodeOpd || !activatedTahun || !activatedBulan
        ? "Pilih OPD, tahun, dan bulan agar data renja OPD muncul."
        : undefined;

    if (infoMessage) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center text-sm text-gray-600">
                {infoMessage}
            </div>
        );
    }

    if (loading || loadingPagu) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center">
                <LoadingBeat loading={true} />
                <p className="text-sm text-gray-600 mt-2">
                    Memuat data renja OPD...
                </p>
            </div>
        );
    }

    if (error || errorPagu) {
        return (
            <div className="rounded border border-red-200 px-4 py-6 text-center text-sm text-red-600">
                Error: {error || errorPagu}
            </div>
        );
    }

    const rowsData = data || [];
    const rowsPagu = paguResponse || [];

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-sky-600 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Rencana Kerja</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">Bidang Urusan/Program/Kegitan/Subkegitan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator</td>
                            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{`Renja Target ${activatedTahun || "2025"} - ${bulanName || ""}`}</th>
                            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{`Renja Pagu ${activatedTahun || "2025"} - ${bulanName || ""}`}</th>
                        </tr>
                        <tr className="bg-sky-600 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Realisasi</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Realisasi</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => {
                            const target = row.targets[0];
                            return (
                                <tr key={row.id}>
                                    <td className="border-x border-b border-sky-600 py-4 px-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {row.renja || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-606 px-6 py-4">
                                        <div className="flex flex-col">
                                            <span>{row.jenisRenja || "-"}</span>
                                            <span className="text-sm text-gray-500">({row.kodeRenja || "-"})</span>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {row.indikator || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.target || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>{target?.realisasi ?? "-"}</span>
                                            <ButtonGreenBorder
                                                className="w-full"
                                                onClick={() => openModal(row, 'target')}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.satuan || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.capaian || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.keteranganCapaian || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.pagu != null ? target.pagu.toLocaleString() : "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>{target?.realistasiPagu != null ? target.realistasiPagu.toLocaleString() : "-"}</span>
                                            <ButtonGreenBorder
                                                className="w-full"
                                                onClick={() => openModal(row, 'pagu')}
                                            >
                                                Realisasi
                                            </ButtonGreenBorder>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.satuanPagu || "-"}
                                    </td>
                                    <td className="border-r border-b border-sky-600 px-6 py-4">
                                        {target?.capaianPagu || "-"}
                                    </td>
                                    <td className="border-x border-b border-sky-600 px-6 py-4">
                                        {target?.keteranganCapaianPagu || "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <FormModal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={`Realisasi Renja ${modalType === 'pagu' ? 'Pagu' : 'Target'} - ${selectedRow?.renja ?? ""}`}
            >
                {modalType === 'pagu' ? (
                    <FormRealisasiRenjaPaguOpd
                        requestValues={selectedRow?.targets ?? []}
                        onClose={closeModal}
                        onSuccess={handleRealisasiSuccess}
                    />
                ) : (
                    <FormRealisasiRenjaTargetOpd
                        requestValues={data?.find(d => d.id === selectedRow?.id) ?? null}
                        onClose={closeModal}
                        onSuccess={handleSuccess}
                    />
                )}
            </FormModal>
        </>
    );
};

export default Table;