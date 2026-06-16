"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { useFetchData } from "@/hooks/useFetchData";
import { getMonthKey, getMonthName } from "@/lib/months";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { canEditPemdaRealisasi } from "@/lib/rbac";
import {
    RealisasiTujuanResponse,
    TargetRealisasiCapaian,
    TujuanPemdaRealisasiGrouped,
} from "@/types";
import React, { useEffect, useState, useMemo } from "react";
import { ModalTujuanPemda } from "./_components/ModalTujuan";
import TableTujuan from "./_components/TableTujuan";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPercentageText } from "@/lib/formatPercentageText";

export default function Tujuan() {
    const { user } = useUserContext();
    const {
        activatedTahun: selectedTahun,
        activatedBulan,
    } = useFilterContext();
    const canEdit = canEditPemdaRealisasi(user);
    const selectedTahunValue = selectedTahun ? parseInt(selectedTahun) : 2025;
    const bulanKey = getMonthKey(activatedBulan ?? null);
    const bulanName = getMonthName(activatedBulan ?? null);

    const {
        data: realisasiData,
        loading: realisasiLoading,
        error: realisasiError,
        refetch: refetchRealisasi,
    } = useFetchData<RealisasiTujuanResponse>({
        url: selectedTahun && bulanKey
            ? `/api/v1/realisasi/tujuans/by-tahun/${selectedTahunValue}/by-bulan/${encodeURIComponent(bulanKey)}`
            : null,
    });

    const [OpenModal, setOpenModal] = useState<boolean>(false);
    const [selectedTujuan, setSelectedTujuan] = useState<
        TargetRealisasiCapaian[]
    >([]);
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [pdfFileName, setPdfFileName] = useState("tujuan-pemda.pdf");
    const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);

    const dataTargetRealisasi = useMemo<TargetRealisasiCapaian[]>(() => {
        return (realisasiData ?? []).map((item) => ({
            targetRealisasiId: item.id ?? null,
            tujuanPemda: item.tujuan ?? "-",
            tujuanId: String(item.tujuanId),
            visiMisi: item.visiMisi ?? "-",
            indikatorId: String(item.indikatorId),
            indikator: item.indikator ?? "-",
            rumusPerhitungan: item.rumusPerhitungan ?? "-",
            sumberData: item.sumberData ?? "-",
            targetId: String(item.targetId),
            target: item.target ?? "-",
            realisasi: item.realisasi ?? 0,
            capaian: item.capaian ?? "-",
            keteranganCapaian: item.keteranganCapaian ?? "-",
            faktorPenunjang: item.faktorPenunjang ?? null,
            faktorPenghambat: item.faktorPenghambat ?? null,
            satuan: item.satuan ?? "-",
            tahun: String(item.tahun ?? ""),
        }));
    }, [realisasiData]);

    const groupedTujuanPemda = useMemo<TujuanPemdaRealisasiGrouped[]>(() => {
        const tujuanMap = new Map<string, TujuanPemdaRealisasiGrouped>();

        dataTargetRealisasi.forEach((item) => {
            const tujuanKey = item.tujuanId;
            const indikatorKey = item.indikatorId;

            let tujuan = tujuanMap.get(tujuanKey);
            if (!tujuan) {
                tujuan = {
                    tujuanId: tujuanKey,
                    tujuanPemda: item.tujuanPemda,
                    visiMisi: item.visiMisi,
                    indikator: [],
                };
                tujuanMap.set(tujuanKey, tujuan);
            }

            let indikator = tujuan.indikator.find((row) => row.id === indikatorKey);
            if (!indikator) {
                indikator = {
                    id: indikatorKey,
                    indikator: item.indikator,
                    rumusPerhitungan: item.rumusPerhitungan,
                    sumberData: item.sumberData,
                    targets: [],
                };
                tujuan.indikator.push(indikator);
            }

            indikator.targets.push(item);
        });

        return Array.from(tujuanMap.values());
    }, [dataTargetRealisasi]);

    useEffect(() => {
        return () => {
            if (pdfPreviewUrl) {
                URL.revokeObjectURL(pdfPreviewUrl);
            }
        };
    }, [pdfPreviewUrl]);

    if (selectedTahun === null || activatedBulan === null || !bulanKey || !bulanName)
        return (
            <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
                Pilih dan aktifkan periode, tahun, dan bulan agar data tujuan pemda muncul.
            </div>
        );
    if (realisasiLoading)
        return <LoadingBeat loading={realisasiLoading} />;
    if (realisasiError)
        return <div>Error fetching realisasi: {realisasiError}</div>;

    if (groupedTujuanPemda.length === 0)
        return (
            <div className="rounded border border-red-200 px-4 py-6 text-center text-sm text-gray-600">
                Data tujuan pemda tidak ada.
            </div>
        );

    const handleOpenModal = (data: TargetRealisasiCapaian[]) => {
        if (!canEdit) return;
        setSelectedTujuan(data);
        setOpenModal(true);
    };

    const sanitizeForPdf = (value: unknown) => {
        if (value == null) return "-";
        let text = String(value);

        try {
            text = text.normalize("NFKC");
        } catch {
            // ignore if environment doesn't support normalize
        }

        text = text
            .replace(/\u2265/g, ">=")
            .replace(/\u2264/g, "<=")
            .replace(/\u00b1/g, "+/-");

        text = text.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, "");
        text = text.replace(/\s+/g, " ").trim();

        return text.length ? text : "-";
    };

    const createPdfDocument = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a3",
        });

        const periodLabel = `${selectedTahunValue} - ${bulanName}`;

        doc.setFontSize(14);
        doc.text("Tujuan Pemda", 40, 40);
        doc.setFontSize(10);
        doc.text(`Periode: ${periodLabel}`, 40, 58);

        const tableHead = [[
            "No",
            "Tujuan",
            "Visi/Misi",
            "Indikator",
            "Rumus Perhitungan",
            "Sumber Data",
            "Target",
            "Realisasi (%)",
            "Capaian",
            "Keterangan Capaian",
            "Faktor Penunjang",
            "Faktor Penghambat",
        ]];

        const tableBody: any[] = [];

        groupedTujuanPemda.forEach((tujuan, tujuanIndex) => {
            if (!tujuan.indikator.length) {
                tableBody.push([
                    tujuanIndex + 1,
                    sanitizeForPdf(tujuan.tujuanPemda),
                    sanitizeForPdf(tujuan.visiMisi),
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                    "-",
                ]);
                return;
            }

            const detailRows: Array<Array<string | number>> = [];

            tujuan.indikator.forEach((indikator) => {
                if (!indikator.targets.length) {
                    detailRows.push([
                        sanitizeForPdf(indikator.indikator),
                        sanitizeForPdf(indikator.rumusPerhitungan),
                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                        "-",
                    ]);
                    return;
                }

                indikator.targets.forEach((target) => {
                    detailRows.push([
                        sanitizeForPdf(indikator.indikator),
                        sanitizeForPdf(indikator.rumusPerhitungan),
                        sanitizeForPdf(indikator.sumberData),
                        sanitizeForPdf(target.target),
                        sanitizeForPdf(target.realisasi ?? 0),
                        sanitizeForPdf(formatPercentageText(target.capaian)),
                        sanitizeForPdf(formatPercentageText(target.keteranganCapaian)),
                        sanitizeForPdf(target.faktorPenunjang ?? '-'),
                        sanitizeForPdf(target.faktorPenghambat ?? '-'),
                    ]);
                });
            });

            detailRows.forEach((detailRow, detailIndex) => {
                if (detailIndex === 0) {
                    tableBody.push([
                        { content: tujuanIndex + 1, rowSpan: detailRows.length },
                        { content: sanitizeForPdf(tujuan.tujuanPemda), rowSpan: detailRows.length },
                        { content: sanitizeForPdf(tujuan.visiMisi), rowSpan: detailRows.length },
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
                lineColor: [248, 113, 113],
                lineWidth: 0.5,
                textColor: [31, 41, 55],
                valign: "top",
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [239, 68, 68],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center",
                valign: "middle",
            },
            columnStyles: {
                0: { cellWidth: 26, halign: "center" },
                1: { cellWidth: 150 },
                2: { cellWidth: 120 },
                3: { cellWidth: 70 },
                4: { cellWidth: 100, halign: "center" },
                5: { cellWidth: 50, halign: "center" },
                6: { cellWidth: 50, halign: "center" },
                7: { cellWidth: 65, halign: "center" },
                8: { cellWidth: 50, halign: "center" },
                9: { cellWidth: 70 },
                10: { cellWidth: 80 },
                11: { cellWidth: 80 },
            },
            tableWidth: "wrap",
            margin: { top: 72, right: 40, bottom: 40, left: 40 },
            theme: "grid",
        });

        const safeMonthLabel = String(bulanName ?? "bulan").replace(/\s+/g, "-").toLowerCase();
        const safeYearLabel = String(selectedTahunValue || "tahun").replace(/\s+/g, "-").toLowerCase();
        const fileName = `tujuan-pemda-${safeYearLabel}-${safeMonthLabel}.pdf`;
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
        <div className="overflow-auto grid gap-2">
            <h2 className="text-lg font-semibold mb-2">Realisasi Tujuan Pemda</h2>
            <div className="mt-2 rounded-t-lg border border-red-400">
                <TableTujuan
                    tahun={parseInt(selectedTahun)}
                    bulanLabel={bulanName}
                    tujuansPemda={groupedTujuanPemda}
                    canEdit={canEdit}
                    handleOpenPrintPreview={handleOpenPrintPreview}
                    handleOpenModal={handleOpenModal}
                    bulanKey={bulanKey}
                    onFaktorSuccess={() => refetchRealisasi()}
                />
                {canEdit && (
                    <ModalTujuanPemda
                        item={selectedTujuan}
                        tahun={parseInt(selectedTahun)}
                        bulan={bulanKey}
                        bulanLabel={bulanName}
                        isOpen={OpenModal}
                        onClose={() => {
                            setOpenModal(false);
                        }}
                        onSuccess={() => {
                            setOpenModal(false);
                            refetchRealisasi();
                        }}
                    />
                )}
            </div>
            {isPrintPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={handleClosePrintPreview}
                    ></div>
                    <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
                        <div className="mb-3 border-b pb-2">
                            <h2 className="text-lg font-semibold uppercase">Preview Cetak Tujuan Pemda</h2>
                            <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
                        </div>

                        <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
                            {pdfPreviewUrl ? (
                                <iframe
                                    title="Preview PDF Tujuan Pemda"
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
        </div>
    );
}
