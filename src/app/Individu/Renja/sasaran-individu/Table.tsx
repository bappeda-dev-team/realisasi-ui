'use client'

import React, { useMemo, useState } from "react";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { useFetchData } from "@/hooks/useFetchData";
import { useApiUrlContext } from "@/context/ApiUrlContext";
import { getMonthKey, getMonthName } from "@/lib/months";
import { formatPercentageText } from "@/lib/formatPercentageText";
import { SasaranIndividuRealisasiGrouped, SasaranTargetRealisasiInfo } from "@/types";
import { canEditIndividuRenjaRealisasi } from "@/lib/rbac";
import { ROLES } from "@/constants/roles";
import FormRealisasiSasaranIndividu from "../_components/FormRealisasiSasaranIndividu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const sanitizeForPdf = (value: unknown) => {
    if (value == null) return "-";
    let text = String(value);

    try {
        text = text.normalize("NFKC");
    } catch {
        // ignore
    }

    text = text.replace(/\u2265/g, ">=").replace(/\u2264/g, "<=").replace(/\u00b1/g, "+/-");
    text = text.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, "");
    text = text.replace(/\s+/g, " ").trim();

    return text.length ? text : "-";
};

const formatWithComma = (value: number | string): string => {
    if (value === null || value === undefined || value === 0) return "-";
    return String(value).replace(".", ",");
};

export default function SasaranIndividuTable() {
    const { activatedDinas, activatedTahun, activatedBulan, namaDinas } = useFilterContext();
    const { user } = useUserContext();
    const { url } = useApiUrlContext();
    const canEditRealisasi = canEditIndividuRenjaRealisasi(user);
    const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD);
    const isOpdScopedView = canBypassNip && Boolean(activatedDinas);

    const bulanKey = getMonthKey(activatedBulan);
    const bulanName = getMonthName(activatedBulan);

    const [selectedTargetInfo, setSelectedTargetInfo] = useState<SasaranTargetRealisasiInfo | null>(null);
    const [isSasaranModalOpen, setIsSasaranModalOpen] = useState(false);
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [pdfFileName, setPdfFileName] = useState<string>("sasaran-individu.pdf");
    const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);

    const apiUrlSasaran = url && activatedTahun && bulanKey && isOpdScopedView && activatedDinas
        ? `${url}/sasaran_opd/${encodeURIComponent(activatedDinas)}/tahun/${encodeURIComponent(activatedTahun)}/penetapan?bulan=${encodeURIComponent(bulanKey)}`
        : url && user?.nip && user?.kode_opd && activatedTahun && bulanKey
        ? `${url}/sasaran_individu/${encodeURIComponent(user.kode_opd)}/nip/${encodeURIComponent(user.nip)}/tahun/${encodeURIComponent(activatedTahun)}/penetapan?bulan=${encodeURIComponent(bulanKey)}`
        : null;

    const {
        data: sasaranResponse,
        loading: loadingSasaran,
        error: errorSasaran,
        refetch: refetchSasaran,
    } = useFetchData<any>({
        url: apiUrlSasaran,
    });

    const groupedSasaranIndividu = useMemo<SasaranIndividuRealisasiGrouped[]>(() => {
        const source = sasaranResponse?.sasaranOpds ?? sasaranResponse?.sasaranIndividus ?? [];

        return source.map((sasaran: any) => ({
            renjaId: sasaran.kode_sasaran_opd,
            renja: sasaran.sasaran_opd,
            nama_pegawai: sasaran.nama_pegawai ?? "-",
            nip: sasaran.nip ?? "-",
            kodeSasaranOpd: sasaran.kode_sasaran_opd,
            kodeOpd: sasaranResponse?.kode_opd ?? "",
            indikator: (sasaran.indikators ?? []).map((ind: any) => ({
                id: ind.kode_indikator,
                indikator: ind.indikator,
                rumusPerhitungan: ind.rumus_perhitungan ?? "-",
                sumberData: ind.sumber_data ?? "-",
                kodeIndikator: ind.kode_indikator,
                targets: (ind.targets ?? []).map((tgt: any) => ({
                    targetRealisasiId: null,
                    renja: sasaran.sasaran_opd,
                    renjaId: sasaran.kode_sasaran_opd,
                    indikatorId: ind.kode_indikator,
                    indikator: ind.indikator,
                    targetId: tgt.kode_target,
                    target: String(tgt.target),
                    realisasi: tgt.realisasi ?? 0,
                    capaian: tgt.capaian != null ? String(tgt.capaian) : "-",
                    keteranganCapaian: tgt.keterangan_capaian ?? "-",
                    satuan: tgt.satuan,
                    tahun: String(sasaranResponse?.tahun ?? ""),
                    nip: sasaran.nip ?? "-",
                    rumusPerhitungan: ind.rumus_perhitungan ?? "-",
                    sumberData: ind.sumber_data ?? "-",
                    jenisRealisasi: "NAIK" as const,
                    bulan: String(sasaranResponse?.bulan ?? ""),
                    kodeTarget: tgt.kode_target,
                })),
            })),
        }));
    }, [sasaranResponse]);

    const handleOpenSasaranModal = (targetInfo: SasaranTargetRealisasiInfo) => {
        if (!canEditRealisasi) return;
        setSelectedTargetInfo(targetInfo);
        setIsSasaranModalOpen(true);
    };

    const handleCloseSasaranModal = () => {
        setIsSasaranModalOpen(false);
        setSelectedTargetInfo(null);
    };

    const createSasaranPdfDocument = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4",
        });

        const periodLabel = `${activatedTahun} - ${bulanName}`;
        const opdTitle = namaDinas ? ` - ${namaDinas}` : "";

        doc.setFontSize(14);
        doc.text(`Sasaran Individu${opdTitle}`, 40, 40);
        doc.setFontSize(10);
        doc.text(`Periode: ${periodLabel}`, 40, 58);

        const tableHead = [[
            "No",
            "Nama Pemilik",
            "Rencana Kerja",
            "Indikator",
            "Rumus Perhitungan",
            "Sumber Data",
            "Target",
            "Realisasi (%)",
            "Capaian",
            "Keterangan Capaian",
        ]];

        const tableBody: any[] = [];

        groupedSasaranIndividu.forEach((renja, renjaIndex) => {
            const detailRows: Array<Array<string | number>> = [];

            if (!renja.indikator.length) {
                detailRows.push(["-", "-", "-", "-", "-", "-", "-"]);
            } else {
                renja.indikator.forEach((indikator) => {
                    if (!indikator.targets.length) {
                        detailRows.push([
                            sanitizeForPdf(indikator.indikator),
                            sanitizeForPdf(indikator.rumusPerhitungan),
                            sanitizeForPdf(indikator.sumberData),
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
                        ]);
                    });
                });
            }

            detailRows.forEach((detailRow, detailIndex) => {
                if (detailIndex === 0) {
                    tableBody.push([
                        { content: renjaIndex + 1, rowSpan: detailRows.length },
                        { content: `${sanitizeForPdf(renja.nama_pegawai)} (${sanitizeForPdf(renja.nip)})`, rowSpan: detailRows.length },
                        { content: sanitizeForPdf(renja.renja), rowSpan: detailRows.length },
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
                lineColor: [16, 185, 129],
                lineWidth: 0.5,
                textColor: [31, 41, 55],
                valign: "top",
                overflow: "linebreak",
            },
            headStyles: {
                fillColor: [5, 150, 105],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                halign: "center",
                valign: "middle",
            },
            columnStyles: {
                0: { cellWidth: 26, halign: "center" },
                1: { cellWidth: 130 },
                2: { cellWidth: 150 },
                3: { cellWidth: 100 },
                4: { cellWidth: 200 },
                5: { cellWidth: 50, halign: "center" },
                6: { cellWidth: 50, halign: "center" },
                7: { cellWidth: 55, halign: "center" },
                8: { cellWidth: 50, halign: "center" },
                9: { cellWidth: 70 },
            },
            tableWidth: "wrap",
            margin: { top: 72, right: 40, bottom: 40, left: 40 },
            theme: "grid",
        });

        const safeMonthLabel = String(bulanName || "bulan").replace(/\s+/g, "-").toLowerCase();
        const safeYearLabel = String(activatedTahun || "tahun").replace(/\s+/g, "-").toLowerCase();
        const fileName = `sasaran-individu-${safeYearLabel}-${safeMonthLabel}.pdf`;

        return { doc, fileName };
    };

    const handleOpenSasaranPrintPreview = () => {
        const { doc, fileName } = createSasaranPdfDocument();
        const previewUrl = String(doc.output("bloburl"));

        if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }

        setPreviewDoc(doc);
        setPdfFileName(fileName);
        setPdfPreviewUrl(previewUrl);
        setIsPrintPreviewOpen(true);
    };

    const handleCloseSasaranPrintPreview = () => {
        if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl);
        }

        setIsPrintPreviewOpen(false);
        setPdfPreviewUrl(null);
        setPreviewDoc(null);
    };

    const handleDownloadSasaranPdf = () => {
        if (!previewDoc) return;
        previewDoc.save(pdfFileName);
    };

    if (loadingSasaran) {
        return (
            <div className="rounded border border-emerald-200 px-4 py-6 text-center">
                <LoadingBeat loading={true} />
                <p className="text-sm text-gray-600 mt-2">Memuat data sasaran individu...</p>
            </div>
        );
    }

    if (errorSasaran) {
        return (
            <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
                Gagal memuat data sasaran: {errorSasaran}
            </div>
        );
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl">
                {groupedSasaranIndividu.length ? (
                    <table className="w-full">
                        <thead>
                            <tr className="text-xm bg-emerald-500 text-white">
                                <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px] text-center">Nama Pemilik</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Rencana Kerja</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Indikator</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</td>
                                <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</td>
                                <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">{activatedTahun} - {bulanName}</th>
                                <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[120px] text-center">Aksi</th>
                            </tr>
                            <tr className="bg-emerald-500 text-white">
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi (%)</th>
                                <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian</th>
                                <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedSasaranIndividu.map((sasaran, sasaranIndex) => {
                                const indikatorList = sasaran.indikator ?? [];

                                if (!indikatorList.length) {
                                    return (
                                        <tr key={sasaran.renjaId}>
                                            <td className="border border-red-400 px-6 py-4 text-center">{sasaranIndex + 1}</td>
                                            <td className="border border-red-400 px-6 py-4 text-center">{sasaran.nama_pegawai} ({sasaran.nip})</td>
                                            <td className="border border-red-400 px-6 py-4 text-center">{sasaran.renja}</td>
                                            <td colSpan={7} className="border border-red-400 px-6 py-4 text-center text-gray-500 italic bg-red-300">
                                                Tidak ada indikator dan target tahun {activatedTahun}
                                            </td>
                                            <td className="border border-emerald-500 px-6 py-4 text-center">
                                                <ButtonGreenBorder className="w-full" onClick={handleOpenSasaranPrintPreview}>
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

                                return indikatorList.map((ind, indikatorIndex) => {
                                    const sortedTargets = [...(ind.targets ?? [])].sort((a, b) => {
                                        const aId = Number(a.targetId);
                                        const bId = Number(b.targetId);
                                        if (!Number.isNaN(aId) && !Number.isNaN(bId)) return aId - bId;
                                        return String(a.targetId).localeCompare(String(b.targetId));
                                    });

                                    const targetsForRows = sortedTargets.length > 0 ? sortedTargets : [null];
                                    const rowSpan = targetsForRows.length;

                                    return targetsForRows.map((target, targetIndex) => (
                                        <tr key={`${ind.id || indikatorIndex}-${target?.targetId ?? `empty-${targetIndex}`}-${activatedTahun}`}>
                                            {indikatorIndex === 0 && targetIndex === 0 && (
                                                <>
                                                    <td rowSpan={totalRows} className="border-x border-b border-emerald-500 py-4 px-3 text-center">{sasaranIndex + 1}</td>
                                                    <td rowSpan={totalRows} className="border-x border-b border-emerald-500 py-4 px-3 text-left">{sasaran.nama_pegawai} ({sasaran.nip})</td>
                                                    <td rowSpan={totalRows} className="border-x border-b border-emerald-500 py-4 px-3 text-left">{sasaran.renja}</td>
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
                                                            {canEditRealisasi && (
                                                                <ButtonGreenBorder
                                                                    className="w-full"
                                                                    onClick={() => handleOpenSasaranModal({
                                                                        kodeSasaranOpd: sasaran.kodeSasaranOpd,
                                                                        sasaranOpd: sasaran.renja,
                                                                        kodeIndikator: ind.kodeIndikator,
                                                                        indikator: ind.indikator,
                                                                        kodeTarget: target.kodeTarget,
                                                                        target: target.target,
                                                                        realisasi: target.realisasi,
                                                                        satuan: target.satuan,
                                                                        kodeOpd: sasaran.kodeOpd,
                                                                        nip: sasaran.nip,
                                                                        namaPegawai: sasaran.nama_pegawai,
                                                                    })}
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
                                                    Tidak ada target di tahun {activatedTahun}
                                                </td>
                                            )}

                                            {targetIndex === 0 && (
                                                <td rowSpan={rowSpan} className="border border-emerald-500 px-6 py-4 text-center">
                                                    <ButtonGreenBorder className="w-full" onClick={handleOpenSasaranPrintPreview}>
                                                        Cetak
                                                    </ButtonGreenBorder>
                                                </td>
                                            )}
                                        </tr>
                                    ));
                                });
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="rounded border border-emerald-200 px-4 py-6 text-center text-sm text-gray-600">
                        Data sasaran individu tidak ada.
                    </div>
                )}
            </div>

            {canEditRealisasi && (
                <FormModal
                    isOpen={isSasaranModalOpen}
                    onClose={handleCloseSasaranModal}
                    title={`Realisasi Sasaran Individu - ${activatedTahun ?? "-"} ${bulanName ?? "-"}`}
                >
                    {selectedTargetInfo ? (
                        <FormRealisasiSasaranIndividu
                            targetInfo={selectedTargetInfo}
                            onClose={handleCloseSasaranModal}
                            onSuccess={() => {
                                handleCloseSasaranModal();
                                refetchSasaran();
                            }}
                        />
                    ) : (
                        <div className="rounded border border-emerald-200 px-4 py-6 text-center">
                            <p className="text-sm text-gray-600 mt-2">Data target tidak ditemukan.</p>
                        </div>
                    )}
                </FormModal>
            )}

            {isPrintPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={handleCloseSasaranPrintPreview}
                    ></div>
                    <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
                        <div className="mb-3 border-b pb-2">
                            <h2 className="text-lg font-semibold uppercase">Preview Cetak Sasaran Individu</h2>
                            <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
                        </div>

                        <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
                            {pdfPreviewUrl ? (
                                <iframe
                                    title="Preview PDF Sasaran Individu"
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
                                onClick={handleCloseSasaranPrintPreview}
                                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={handleDownloadSasaranPdf}
                                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                            >
                                Unduh PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
