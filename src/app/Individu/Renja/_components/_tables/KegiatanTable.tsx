'use client'

import React, { useEffect, useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useFetchData } from "@/hooks/useFetchData";
import { getMonthKey, getMonthName } from "@/lib/months";
import { formatPercentageText } from "@/lib/formatPercentageText";
import { getHeaderColor, getHeaderFillColor } from "@/lib/userLevelStyle";
import {
    RenjaTarget,
    RenjaKegiatanIndividuResponse,
} from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FormRealisasiRenjaTargetIndividuKegiatan from "../_modals/FormRealisasiRenjaTargetIndividuKegiatan";
import FormFaktorPenunjangRenjaIndividuKegiatan from "../_modals/faktor-penunjang/FormFaktorPenunjangRenjaIndividuKegiatan";
import FormFaktorPenghambatRenjaIndividuKegiatan from "../_modals/faktor-penghambat/FormFaktorPenghambatRenjaIndividuKegiatan";
import { ROLES } from "@/constants/roles";
import { canEditIndividuRenjaRealisasi } from "@/lib/rbac";
import { getSessionId } from '@/lib/session';

interface RenjaRow {
    id: number;
    renja: string;
    nama_pegawai: string;
    nip: string;
    kodeRenja: string;
    jenisRenja: string;
    indikator: string;
    targets: RenjaTarget[];
}

const KegiatanTable = () => {
    const [rows, setRows] = useState<RenjaRow[]>([]);
    const [selectedRow, setSelectedRow] = useState<RenjaRow | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [pdfFileName, setPdfFileName] = useState<string>("renja-individu-kegiatan.pdf");
    const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);
    const [modalType, setModalType] = useState<'target' | 'pagu'>('target');
    const [selectedFaktorRow, setSelectedFaktorRow] = useState<RenjaRow | null>(null);
    const [isFaktorPenunjangModalOpen, setIsFaktorPenunjangModalOpen] = useState(false);
    const [isFaktorPenghambatModalOpen, setIsFaktorPenghambatModalOpen] = useState(false);

    const { tahun: selectedTahun, activatedDinas, activatedTahun, activatedBulan, namaDinas } = useFilterContext();
    const { user } = useUserContext();
    const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD);
    const canEditRealisasi = canEditIndividuRenjaRealisasi(user);
    const isOpdScopedView = canBypassNip && Boolean(activatedDinas);

    const userLevel = user?.roles.find(r => r.startsWith('level_'));
    const headerColor = getHeaderColor(userLevel);
    const headerFillColor = getHeaderFillColor(userLevel);

    const bulanKey = getMonthKey(activatedBulan);
    const bulanName = getMonthName(activatedBulan);

    // Determine kodeOpd and nip for the kegiatan endpoint
    const effectiveKodeOpd = isOpdScopedView && activatedDinas ? activatedDinas : (user?.kode_opd ?? null);
    const effectiveNip = isOpdScopedView ? (user?.nip ?? null) : (user?.nip ?? null);

    const apiUrl = effectiveKodeOpd && effectiveNip && activatedTahun && bulanKey
        ? `/api/v1/realisasi/renja_individu/kegiatan/kodeOpd/${encodeURIComponent(effectiveKodeOpd)}/nip/${encodeURIComponent(effectiveNip)}/tahun/${encodeURIComponent(activatedTahun)}/bulan/${encodeURIComponent(bulanKey)}`
        : null;

    const { data, loading, error, refetch } = useFetchData<RenjaKegiatanIndividuResponse[]>({
        url: apiUrl,
    });

    useEffect(() => {
        if (!activatedTahun || !bulanKey) {
            setRows([]);
            return;
        }

        if (!data) {
            setRows([]);
            return;
        }

        setRows(
            data.map((item) => ({
                id: item.id,
                renja: item.kegiatan ?? "-",
                nama_pegawai: item.nip ?? "-",
                nip: item.nip ?? "-",
                kodeRenja: item.kodeKegiatan ?? "-",
                jenisRenja: "KEGIATAN",
                indikator: item.indikator ?? "-",
                targets: [{
                    targetRealisasiId: item.id ?? null,
                    renjaId: item.kodeKegiatan ?? "",
                    renja: item.kegiatan ?? "-",
                    kodeRenja: item.kodeKegiatan ?? "-",
                    jenisRenja: "KEGIATAN",
                    nip: item.nip ?? "-",
                    idIndikator: item.kodeIndikator ?? "",
                    indikator: item.indikator ?? "-",
                    targetId: item.kodeTarget ?? "",
                    target: String(item.target ?? "-"),
                    realisasi: item.realisasi,
                    satuan: "%",
                    tahun: item.tahun ?? activatedTahun ?? "",
                    bulan: item.bulan ?? bulanName ?? undefined,
                    jenisRealisasi: item.jenisRealisasi as "NAIK" | "TURUN",
                    capaian: String(item.capaian ?? "-"),
                    keteranganCapaian: item.keteranganCapaian ?? "-",
                    pagu: item.pagu ?? null,
                    realisasiPagu: item.realisasi ?? null,
                    satuanPagu: "Rupiah",
                    capaianPagu: String(item.capaian ?? "-"),
                    keteranganCapaianPagu: item.keteranganCapaian ?? "-",
                    faktorPenunjang: item.faktorPenunjang ?? null,
                    faktorPenghambat: item.faktorPenghambat ?? null,
                    kodeOpd: item.kodeOpd ?? effectiveKodeOpd ?? "",
                    kodePagu: item.kodePagu ?? "",
                    targetRealisasi: item.target ?? 0,
                }],
            }))
        );
    }, [data, user, activatedTahun, bulanKey, bulanName]);

    const openModal = (row: RenjaRow, type: 'target' | 'pagu' = 'target') => {
        if (!canEditRealisasi) return;
        setSelectedRow(row);
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
        setModalType('target');
    };

    const handleOpenFaktorPenunjang = (row: RenjaRow) => {
        if (!canEditRealisasi) return;
        setSelectedFaktorRow(row);
        setIsFaktorPenunjangModalOpen(true);
    };

    const handleCloseFaktorPenunjang = () => {
        setIsFaktorPenunjangModalOpen(false);
        setSelectedFaktorRow(null);
    };

    const handleOpenFaktorPenghambat = (row: RenjaRow) => {
        if (!canEditRealisasi) return;
        setSelectedFaktorRow(row);
        setIsFaktorPenghambatModalOpen(true);
    };

    const handleCloseFaktorPenghambat = () => {
        setIsFaktorPenghambatModalOpen(false);
        setSelectedFaktorRow(null);
    };

    const handleRealisasiSuccess = (updatedTargets: RenjaTarget[]) => {
        if (!selectedRow) return;
        setRows((previous) =>
            previous.map((row) =>
                row.id === selectedRow.id ? { ...row, targets: updatedTargets } : row
            )
        );
        setIsModalOpen(false);
        setSelectedRow(null);
        refetch();
    };

    const formatRupiah = (value: number | null | undefined): string => {
        if (value == null) return "-";
        return value.toLocaleString('id-ID');
    };

    const createPdfDocument = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a3",
        });

        const periodLabel = `${activatedTahun} - ${bulanName}`;
        const opdTitle = namaDinas ? ` - ${namaDinas}` : "";

        doc.setFontSize(14);
        doc.text(`Renja Individu (Kegiatan)${opdTitle}`, 40, 40);
        doc.setFontSize(10);
        doc.text(`Periode: ${periodLabel}`, 40, 58);

        const tableHead: any[] = [
            [
                { content: "No", rowSpan: 2 },
                { content: "Nama/NIP", rowSpan: 2 },
                { content: "Kegiatan", rowSpan: 2 },
                { content: "Indikator", rowSpan: 2 },
                { content: `Renja Kegiatan ${activatedTahun} - ${bulanName}`, colSpan: 5 },
                { content: "Faktor Penunjang", rowSpan: 2 },
                { content: "Faktor Penghambat", rowSpan: 2 },
            ],
            [
                "Target (%)",
                "Realisasi (%)",
                "Capaian (%)",
                "Keterangan Capaian",
                "Pagu (Rp.)",
            ],
        ];

        const tableBody: any[] = [];

        rows.forEach((row, index) => {
            const targets = row.targets.length ? row.targets : [null];

            targets.forEach((target, targetIndex) => {
                const detailRow = [
                    target?.target || "-",
                    target?.realisasi ?? "-",
                    formatPercentageText(target?.capaian || "-").replace(/%$/, ""),
                    formatPercentageText(target?.keteranganCapaian || "-"),
                    formatRupiah(target?.pagu),
                    target?.faktorPenunjang || "-",
                    target?.faktorPenghambat || "-",
                ];

                if (targetIndex === 0) {
                    tableBody.push([
                        { content: index + 1, rowSpan: targets.length },
                        { content: `${user?.firstName || "-"} \n (${row.nip || "-"})`, rowSpan: targets.length },
                        { content: `${row.jenisRenja || "-"} (${row.kodeRenja || "-"})`, rowSpan: targets.length },
                        { content: row.indikator || "-", rowSpan: targets.length },
                        ...detailRow,
                    ]);
                    return;
                }

                tableBody.push(detailRow);
            });
        });

        autoTable(doc, {
            head: tableHead,
            body: tableBody,
            startY: 72,
            styles: {
                fontSize: 8,
                cellPadding: 3,
                lineColor: [22, 163, 74],
                lineWidth: 0.5,
                textColor: [31, 41, 55],
                valign: "top",
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: headerFillColor,
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center",
                valign: "middle",
                lineColor: [255, 255, 255],
                lineWidth: 0.5,
            },
            columnStyles: {
                0: { cellWidth: 26, halign: "center" },
                1: { cellWidth: 100 },
                2: { cellWidth: 118 },
                3: { cellWidth: 128 },
                4: { cellWidth: 48, halign: "center" },
                5: { cellWidth: 52, halign: "center" },
                6: { cellWidth: 46, halign: "center" },
                7: { cellWidth: 50, halign: "center" },
                8: { cellWidth: 80 },
                9: { cellWidth: 110 },
                10: { cellWidth: 110 },
            },
            tableWidth: "wrap",
            margin: { top: 72, right: 40, bottom: 40, left: 40 },
            theme: "grid",
        });

        const safeMonthLabel = String(bulanName || "bulan").replace(/\s+/g, "-").toLowerCase();
        const safeYearLabel = String(activatedTahun || "tahun").replace(/\s+/g, "-").toLowerCase();
        const fileName = `renja-individu-kegiatan-${safeYearLabel}-${safeMonthLabel}.pdf`;
        return { doc, fileName };
    };

    const handleOpenPrintPreview = () => {
        const { doc, fileName } = createPdfDocument();
        const previewUrl = String(doc.output("bloburl"));

        if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }

        setPreviewDoc(doc);
        setPdfFileName(fileName);
        setPdfPreviewUrl(previewUrl);
        setIsPrintPreviewOpen(true);
    };

    const handleClosePrintPreview = () => {
        if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }

        setIsPrintPreviewOpen(false);
        setPdfPreviewUrl(null);
        setPreviewDoc(null);
    };

    const handleDownloadPdf = () => {
        if (!previewDoc) return;
        previewDoc.save(pdfFileName);
    };

    return (
        <>
            <div className="m-2 rounded-t-xl">
                <div className="flex justify-between items-center px-4 py-3">
                    <h3 className="font-semibold text-gray-800">Renja Individu (Kegiatan)</h3>
                </div>
                {loading ? (
                    <div className="rounded border border-emerald-200 px-4 py-6 text-center">
                        <LoadingBeat loading={true} />
                        <p className="text-sm text-gray-600 mt-2">
                            Memuat data renja kegiatan individu...
                        </p>
                    </div>
                ) : error ? (
                    <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
                        Gagal memuat data renja: {error}
                    </div>
                ) : rows.length ? (
                    <div className="overflow-auto">
                        <table id="print-area-renja-kegiatan" className="w-full">
                            <thead>
                                <tr className={`text-xm ${headerColor}`}>
                                    <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Nama/NIP</td>
                                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">Kegiatan</td>
                                    <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator</td>
                                    <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">{`Renja Kegiatan ${activatedTahun} - ${bulanName}`}</th>
                                    <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[150px] text-center">Faktor Penunjang</th>
                                    <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[150px] text-center">Faktor Penghambat</th>
                                    <td rowSpan={2} className="border-l border-b px-6 py-3 min-w-[120px] text-center">Aksi</td>
                                </tr>
                                <tr className={headerColor}>
                                    <th className="border-l border-b px-6 py-3 min-w-[80px]">Target (%)</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[100px]">Realisasi (%)</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[80px]">Capaian (%)</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                                    <th className="border-l border-b px-6 py-3 min-w-[80px]">Pagu (Rp.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, index) => {
                                    const target = row.targets[0];
                                    return (
                                        <tr key={row.id}>
                                            <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                                                {index + 1}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-800">{user?.firstName || "-"}</span>
                                                    <span className="text-sm text-gray-500">({row.nip || "-"})</span>
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span>{row.jenisRenja || "-"}</span>
                                                    <span className="text-sm text-gray-500">({row.kodeRenja || "-"})</span>
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                {row.indikator || "-"}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                {target?.target || "-"}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span>{target?.realisasi ?? "-"}</span>
                                                    {canEditRealisasi && (
                                                        <ButtonGreenBorder
                                                            className="w-full"
                                                            onClick={() => openModal(row, 'target')}
                                                        >
                                                            Realisasi
                                                        </ButtonGreenBorder>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-11 py-4">
                                                {formatPercentageText(target?.capaian || "-").replace(/%$/, "")}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                {formatPercentageText(target?.keteranganCapaian || "-")}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                {formatRupiah(target?.pagu)}
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span>{target?.faktorPenunjang || "-"}</span>
                                                    {canEditRealisasi && (
                                                        <ButtonGreenBorder
                                                            className="w-full text-xs py-0.5"
                                                            onClick={() => handleOpenFaktorPenunjang(row)}
                                                        >
                                                            Faktor
                                                        </ButtonGreenBorder>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span>{target?.faktorPenghambat || "-"}</span>
                                                    {canEditRealisasi && (
                                                        <ButtonGreenBorder
                                                            className="w-full text-xs py-0.5"
                                                            onClick={() => handleOpenFaktorPenghambat(row)}
                                                        >
                                                            Faktor
                                                        </ButtonGreenBorder>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-emerald-500 px-6 py-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <ButtonGreenBorder
                                                        className="w-full"
                                                        onClick={handleOpenPrintPreview}
                                                    >
                                                        Cetak
                                                    </ButtonGreenBorder>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="rounded border border-red-200 px-4 py-6 text-center text-sm text-gray-600">
                        Data renja kegiatan individu tidak ada.
                    </div>
                )}
            </div>

            {canEditRealisasi && (
                <FormModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    title={`Realisasi Renja - ${selectedRow?.nip ?? selectedRow?.renja ?? ""}`}
                >
                    <FormRealisasiRenjaTargetIndividuKegiatan
                        requestValues={selectedRow?.targets ?? []}
                        onClose={closeModal}
                        onSuccess={handleRealisasiSuccess}
                    />
                </FormModal>
            )}

            {canEditRealisasi && (
                <FormModal
                    isOpen={isFaktorPenunjangModalOpen}
                    onClose={handleCloseFaktorPenunjang}
                    title={`Faktor Penunjang - ${selectedFaktorRow?.renja ?? selectedFaktorRow?.nip ?? ""}`}
                >
                    <FormFaktorPenunjangRenjaIndividuKegiatan
                        kodeOpd={selectedFaktorRow?.targets[0]?.kodeOpd ?? effectiveKodeOpd ?? ""}
                        kode={selectedFaktorRow?.targets[0]?.renjaId ?? ""}
                        kodeIndikator={selectedFaktorRow?.targets[0]?.idIndikator ?? ""}
                        kodeTarget={selectedFaktorRow?.targets[0]?.targetId ?? ""}
                        tahun={activatedTahun ?? ""}
                        bulan={bulanName ?? ""}
                        currentValue={selectedFaktorRow?.targets[0]?.faktorPenunjang ?? ""}
                        onClose={handleCloseFaktorPenunjang}
                        onSuccess={() => {
                            handleCloseFaktorPenunjang();
                            refetch();
                        }}
                    />
                </FormModal>
            )}

            {canEditRealisasi && (
                <FormModal
                    isOpen={isFaktorPenghambatModalOpen}
                    onClose={handleCloseFaktorPenghambat}
                    title={`Faktor Penghambat - ${selectedFaktorRow?.renja ?? selectedFaktorRow?.nip ?? ""}`}
                >
                    <FormFaktorPenghambatRenjaIndividuKegiatan
                        kodeOpd={selectedFaktorRow?.targets[0]?.kodeOpd ?? effectiveKodeOpd ?? ""}
                        kode={selectedFaktorRow?.targets[0]?.renjaId ?? ""}
                        kodeIndikator={selectedFaktorRow?.targets[0]?.idIndikator ?? ""}
                        kodeTarget={selectedFaktorRow?.targets[0]?.targetId ?? ""}
                        tahun={activatedTahun ?? ""}
                        bulan={bulanName ?? ""}
                        currentValue={selectedFaktorRow?.targets[0]?.faktorPenghambat ?? ""}
                        onClose={handleCloseFaktorPenghambat}
                        onSuccess={() => {
                            handleCloseFaktorPenghambat();
                            refetch();
                        }}
                    />
                </FormModal>
            )}

            {isPrintPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={handleClosePrintPreview}
                    ></div>
                    <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
                        <div className="mb-3 border-b pb-2">
                            <h2 className="text-lg font-semibold uppercase">Preview Cetak Renja Individu (Kegiatan)</h2>
                            <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
                        </div>

                        <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
                            {pdfPreviewUrl ? (
                                <iframe
                                    title="Preview PDF Renja Individu"
                                    src={pdfPreviewUrl}
                                    className="h-full w-full"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                                    Gagal memuat preview PDF.
                                </div>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleClosePrintPreview}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default KegiatanTable;
