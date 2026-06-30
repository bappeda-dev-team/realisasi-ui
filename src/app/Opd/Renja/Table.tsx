'use client'

import React, { useEffect, useMemo, useState } from "react";
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { FormModal } from "@/components/Global/Modal";
import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { useFetchData } from "@/hooks/useFetchData";
import { getMonthKey, getMonthName } from "@/lib/months";
import { formatPercentageText } from "@/lib/formatPercentageText";
import { RenjaPenetapanResponse, RenjaPenetapanIndikator, RenjaPenetapanProgram, RenjaPenetapanKegiatan, RenjaPenetapanSubkegiatan } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FormFaktorPenunjangRenjaOpd from "./_components/FormFaktorPenunjangRenjaOpd";
import FormFaktorPenghambatRenjaOpd from "./_components/FormFaktorPenghambatRenjaOpd";

interface RenjaNodeTargetValue {
    targetRealisasiId?: number | null;
    id_target: string;
    target: string;
    realisasi?: string | number | null;
    satuan?: string | null;
    capaian?: string | null;
    jenisRealisasi?: string | null;
    status?: string | null;
    createdBy?: string | null;
    lastModifiedBy?: string | null;
    keteranganCapaian?: string | null;
    faktorPenunjang?: string | null;
    faktorPenghambat?: string | null;
}

interface RenjaNodePaguValue {
    paguRealisasiId?: number | null;
    realisasi?: string | number | null;
    pagu?: number | null;
    status?: string | null;
    createdBy?: string | null;
    lastModifiedBy?: string | null;
    capaian?: string | null;
    keteranganCapaian?: string | null;
}

interface RenjaNodeIndikatorValue {
    id_indikator: string;
    indikator: string;
}

interface RenjaHierarchyNode {
    kode_renja: string;
    nama_renja: string | null;
    jenis_renja: string;
    target?: RenjaNodeTargetValue[];
    pagu?: RenjaNodePaguValue[];
    indikator?: RenjaNodeIndikatorValue[];
    program?: RenjaHierarchyNode[];
    kegiatan?: RenjaHierarchyNode[];
    subkegiatan?: RenjaHierarchyNode[];
}

interface RenjaOpdHierarchyResponse {
    kode_opd: string;
    tahun: string;
    bulan: string;
    pagu_total_realisasi: number;
    id_renja: string;
    program?: RenjaHierarchyNode[];
}

type RenjaLevel = "Program" | "Kegiatan" | "Subkegiatan";

interface FlattenedRenjaRow {
    id: string;
    kodeOpd: string;
    tahun: string;
    bulan: string;
    programKey: string;
    programNumber: number;
    hierarchyLevel: number;
    kodeRenja: string;
    namaRenja: string;
    jenisRenja: string;
    indikator: string;
    targets: Array<{
        targetRealisasiId: number | null;
        renjaId: string;
        renja: string;
        kodeRenja: string;
        jenisRenja: RenjaLevel;
        indikatorId: string;
        indikator: string;
        targetId: string;
        target: string;
        realisasi: number | null;
        satuan: string;
        tahun: string;
        jenisRealisasi: string;
        capaian: string;
        keteranganCapaian: string;
        faktorPenunjang: string;
        faktorPenghambat: string;
        pagu: number | null;
        realistasiPagu: number | null;
        satuanPagu: string;
        capaianPagu: string;
        keteranganCapaianPagu: string;
    }>;
}

type SelectedFaktorTarget = {
    target: FlattenedRenjaRow["targets"][number];
    jenis: "penunjang" | "penghambat";
};

const normalizeJenisRenja = (jenisRenja: string | undefined) => {
    switch ((jenisRenja || "").toUpperCase()) {
        case "PROGRAM":
            return "Program";
        case "KEGIATAN":
            return "Kegiatan";
        case "SUBKEGIATAN":
            return "Subkegiatan";
        default:
            return jenisRenja || "-";
    }
};

const formatRenjaName = (node: RenjaHierarchyNode) => {
    const label = normalizeJenisRenja(node.jenis_renja);
    const name = node.nama_renja?.trim();

    if (name) {
        return `${label} - ${name}`;
    }

    return label;
};

const joinIndikator = (indikator: RenjaNodeIndikatorValue[] | undefined) => {
    if (!indikator?.length) return "-";
    return indikator
        .map((item) => item.indikator?.trim())
        .filter(Boolean)
        .join("\n");
};

const joinTarget = (target: RenjaNodeTargetValue[] | undefined) => {
    if (!target?.length) return "-";
    return target
        .map((item) => item.target?.trim())
        .filter(Boolean)
        .join("\n");
};

const parseNumericValue = (value: string | number | null | undefined) => {
    if (value === null || value === undefined || value === "") return null;
    if (typeof value === "number") return Number.isFinite(value) ? value : null;

    const normalized = value.toString().replace(/,/g, "").trim();
    if (!normalized) return null;

    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? null : parsed;
};

const convertIndikatorsToNode = (
    indikators: RenjaPenetapanIndikator[],
): { targetArray: RenjaNodeTargetValue[]; indikatorArray: RenjaNodeIndikatorValue[] } => {
    const targetArray: RenjaNodeTargetValue[] = [];
    const indikatorArray: RenjaNodeIndikatorValue[] = [];

    indikators.forEach((ind) => {
        indikatorArray.push({ id_indikator: ind.kode_indikator, indikator: ind.indikator });

        ind.targets.forEach((tgt) => {
            targetArray.push({
                targetRealisasiId: null,
                id_target: tgt.kode_target,
                target: String(tgt.target),
                realisasi: tgt.realisasi,
                satuan: tgt.satuan,
                capaian: tgt.capaian != null ? String(tgt.capaian) : null,
                jenisRealisasi: null,
                status: null,
                createdBy: null,
                lastModifiedBy: null,
                keteranganCapaian: tgt.keterangan_capaian,
                faktorPenunjang: tgt.faktor_penunjang ?? null,
                faktorPenghambat: tgt.faktor_penghambat ?? null,
            });
        });
    });

    return { targetArray, indikatorArray };
};

const makePaguNode = (paguAnggaran: number | null): RenjaNodePaguValue[] => {
    if (paguAnggaran == null) return [];
    return [{
        paguRealisasiId: null,
        realisasi: null,
        pagu: paguAnggaran,
        status: null,
        createdBy: null,
        lastModifiedBy: null,
        capaian: null,
        keteranganCapaian: null,
    }];
};

const buildHierarchyNode = (
    kode: string,
    nama: string,
    jenis: string,
    indikators: RenjaPenetapanIndikator[],
    paguAnggaran: number | null,
): RenjaHierarchyNode => {
    const { targetArray, indikatorArray } = convertIndikatorsToNode(indikators);

    return {
        kode_renja: kode,
        nama_renja: nama,
        jenis_renja: jenis,
        target: targetArray.length > 0 ? targetArray : undefined,
        indikator: indikatorArray.length > 0 ? indikatorArray : undefined,
        pagu: makePaguNode(paguAnggaran),
    };
};

const transformPenetapanToHierarchy = (response: RenjaPenetapanResponse): RenjaOpdHierarchyResponse[] => {
    const { kode_opd, tahun, bulan, programs, kegiatans, subkegiatans } = response;

    const hierarchyPrograms: RenjaHierarchyNode[] = programs.map((prog) => {
        const programNode = buildHierarchyNode(prog.kode_program, prog.program, "PROGRAM", prog.indikators, prog.pagu_anggaran);

        const childKegiatans = kegiatans.filter((k) => k.kode_kegiatan.startsWith(prog.kode_program));

        programNode.kegiatan = childKegiatans.map((keg) => {
            const kegiatanNode = buildHierarchyNode(keg.kode_kegiatan, keg.kegiatan, "KEGIATAN", keg.indikators, keg.pagu_anggaran);

            const childSubkegiatans = subkegiatans.filter((s) => s.kode_subkegiatan.startsWith(keg.kode_kegiatan));

            kegiatanNode.subkegiatan = childSubkegiatans.map((sub) =>
                buildHierarchyNode(sub.kode_subkegiatan, sub.subkegiatan, "SUBKEGIATAN", sub.indikators, sub.pagu_anggaran),
            );

            return kegiatanNode;
        });

        return programNode;
    });

    return [{
        kode_opd,
        tahun: String(tahun),
        bulan: String(bulan),
        pagu_total_realisasi: 0,
        id_renja: `renja-penetapan-${kode_opd}-${tahun}-${bulan}`,
        program: hierarchyPrograms,
    }];
};

type FaktorCellProps = {
    value?: string | null;
    isRealisasiFilled: boolean;
    onEdit: () => void;
};

const FaktorCell: React.FC<FaktorCellProps> = ({ value, isRealisasiFilled, onEdit }) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <span>{value || "-"}</span>
            <ButtonGreenBorder
                className="w-full text-xs py-0.5"
                onClick={onEdit}
                disabled={!isRealisasiFilled}
            >
                Faktor
            </ButtonGreenBorder>
        </div>
    );
};

const Table = () => {
    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [pdfFileName, setPdfFileName] = useState<string>("renja-opd.pdf");
    const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);
    const [selectedFaktorTarget, setSelectedFaktorTarget] = useState<SelectedFaktorTarget | null>(null);

    const { activatedDinas: kodeOpd, activatedTahun, activatedBulan, namaDinas } = useFilterContext();

    const bulanKey = getMonthKey(activatedBulan);
    const bulanName = getMonthName(activatedBulan);

    const getHeaderColorByJenisRenja = (jenisRenja: string | undefined) => {
        const normalizedJenisRenja = (jenisRenja || "").toLowerCase();

        if (normalizedJenisRenja.includes("program")) return "bg-blue-600 text-white";
        if (normalizedJenisRenja.includes("subkegiatan") || normalizedJenisRenja.includes("sub kegiatan")) return "bg-lime-500 text-white";
        if (normalizedJenisRenja.includes("kegiatan")) return "bg-green-700 text-white";

        return "bg-sky-600 text-white";
    };

    const getHeaderFillColorByJenisRenja = (jenisRenja: string | undefined): [number, number, number] => {
        const normalizedJenisRenja = (jenisRenja || "").toLowerCase();

        if (normalizedJenisRenja.includes("program")) return [37, 99, 235];
        if (normalizedJenisRenja.includes("subkegiatan") || normalizedJenisRenja.includes("sub kegiatan")) return [132, 204, 22];
        if (normalizedJenisRenja.includes("kegiatan")) return [21, 128, 61];

        return [2, 132, 199];
    };

    const apiUrl = kodeOpd && activatedTahun && bulanKey
        ? `/api/v1/realisasi/renja_opd/${kodeOpd}/tahun/${activatedTahun}/penetapan?bulan=${encodeURIComponent(bulanKey)}`
        : null;

    const { data, loading, error, refetch } = useFetchData<RenjaPenetapanResponse>({ url: apiUrl });

    const hierarchyData = useMemo(() => {
        if (!data) return [] as RenjaOpdHierarchyResponse[];
        return transformPenetapanToHierarchy(data);
    }, [data]);

    const rows = useMemo(() => {
        const targetRoots = hierarchyData;
        if (!targetRoots.length) return [] as FlattenedRenjaRow[];

        const flattenedRows: FlattenedRenjaRow[] = [];

        const pushRows = (
            node: RenjaHierarchyNode,
            root: RenjaOpdHierarchyResponse,
            programNode: RenjaHierarchyNode,
            programNumber: number,
            hierarchyLevel: number,
        ) => {
            const targetItems = node.target?.length ? node.target : [undefined];

            targetItems.forEach((targetItem, index) => {
                const indikatorId = node.indikator?.[0]?.id_indikator ?? "";
                const indikatorText = joinIndikator(node.indikator);
                const targetText = targetItem?.target ?? (index === 0 ? joinTarget(node.target) : "-");
                const paguItem = node.pagu?.[0];

                flattenedRows.push({
                    id: `${root.id_renja || 'renja'}-${node.kode_renja}-${targetItem?.id_target ?? 'row'}-${index}`,
                    kodeOpd: root.kode_opd ?? kodeOpd ?? "-",
                    tahun: root.tahun ?? activatedTahun ?? "",
                    bulan: root.bulan ?? bulanKey ?? "",
                    programKey: programNode.kode_renja,
                    programNumber,
                    hierarchyLevel,
                    kodeRenja: node.kode_renja ?? "-",
                    namaRenja: node.nama_renja?.trim() || "-",
                    jenisRenja: normalizeJenisRenja(node.jenis_renja),
                    indikator: indikatorText,
                    targets: [{
                        targetRealisasiId: null,
                        renjaId: node.kode_renja ?? "",
                        renja: formatRenjaName(node),
                        kodeRenja: node.kode_renja ?? "",
                        jenisRenja: normalizeJenisRenja(node.jenis_renja) as RenjaLevel,
                        indikatorId,
                        indikator: indikatorText,
                        targetId: targetItem?.id_target ?? "",
                        target: targetText,
                        realisasi: parseNumericValue(targetItem?.realisasi),
                        satuan: targetItem?.satuan ?? "-",
                        tahun: root.tahun ?? activatedTahun ?? "",
                        jenisRealisasi: "NAIK",
                        capaian: targetItem?.capaian ?? "-",
                        keteranganCapaian: targetItem?.keteranganCapaian ?? "-",
                        faktorPenunjang: targetItem?.faktorPenunjang ?? "-",
                        faktorPenghambat: targetItem?.faktorPenghambat ?? "-",
                        pagu: paguItem?.pagu ?? null,
                        realistasiPagu: null,
                        satuanPagu: "Rupiah",
                        capaianPagu: "-",
                        keteranganCapaianPagu: "-",
                    }],
                });
            });

            node.program?.forEach((child) => pushRows(child, root, programNode, programNumber, hierarchyLevel + 1));
            node.kegiatan?.forEach((child) => pushRows(child, root, programNode, programNumber, hierarchyLevel + 1));
            node.subkegiatan?.forEach((child) => pushRows(child, root, programNode, programNumber, hierarchyLevel + 1));
        };

        let programNumber = 0;

        targetRoots.forEach((root) => root.program?.forEach((node) => {
            programNumber += 1;
            pushRows(node, root, node, programNumber, 0);
        }));

        return flattenedRows;
    }, [activatedTahun, bulanKey, hierarchyData, kodeOpd]);

    const programRowSpans = useMemo(() => {
        const rowSpanMap = new Map<string, number>();

        rows.forEach((row) => {
            rowSpanMap.set(row.programKey, (rowSpanMap.get(row.programKey) ?? 0) + 1);
        });

        return rowSpanMap;
    }, [rows]);

    const firstRowIdByProgram = useMemo(() => {
        const firstRowMap = new Map<string, string>();

        rows.forEach((row) => {
            if (!firstRowMap.has(row.programKey)) {
                firstRowMap.set(row.programKey, row.id);
            }
        });

        return firstRowMap;
    }, [rows]);

    const getHierarchyIndentClass = (hierarchyLevel: number) => {
        switch (hierarchyLevel) {
            case 0:
                return "pl-0";
            case 1:
                return "pl-4";
            case 2:
                return "pl-8";
            case 3:
                return "pl-12";
            default:
                return "pl-16";
        }
    };

    const getHierarchyCellColorClass = (jenisRenja: string) => {
        switch ((jenisRenja || "").toLowerCase()) {
            case "program":
                return "bg-blue-600 text-white";
            case "kegiatan":
                return "bg-green-700 text-white";
            case "subkegiatan":
                return "bg-lime-400 text-slate-900";
            default:
                return "bg-white text-slate-900";
        }
    };

    const getHierarchyCellColorForPdf = (jenisRenja: string): { fillColor?: [number, number, number]; textColor?: [number, number, number] } => {
        switch ((jenisRenja || "").toLowerCase()) {
            case "program":
                return { fillColor: [37, 99, 235], textColor: [255, 255, 255] };
            case "kegiatan":
                return { fillColor: [21, 128, 61], textColor: [255, 255, 255] };
            case "subkegiatan":
                return { fillColor: [163, 230, 53], textColor: [15, 23, 42] };
            default:
                return { fillColor: [255, 255, 255], textColor: [31, 41, 55] };
        }
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
        doc.text(`Renja OPD${opdTitle}`, 40, 40);
        doc.setFontSize(10);
        doc.text(`Periode: ${periodLabel}`, 40, 58);

        const tableHead: any[] = [
            [
                { content: "No", rowSpan: 2 },
                { content: "Program/Kegiatan/Subkegiatan", rowSpan: 2 },
                { content: "Indikator", rowSpan: 2 },
                { content: `Renja Target ${activatedTahun} - ${bulanName}`, colSpan: 4 },
                { content: `Renja Pagu ${activatedTahun} - ${bulanName}`, colSpan: 4 },
                { content: "Faktor Penunjang", rowSpan: 2 },
                { content: "Faktor Penghambat", rowSpan: 2 },
            ],
            [
                "Target (%)",
                "Realisasi\n(%)",
                "Capaian (%)",
                "Keterangan Capaian",
                "Pagu (Rp.)",
                "Realisasi\n(Rp.)",
                "Capaian (%)",
                "Keterangan Capaian",
            ],
        ];

        const tableBody: any[] = [];

        const renderedProgram = new Set<string>();

        rows.forEach((row) => {
            const target = row.targets[0];
            const isFirstRowInProgram = !renderedProgram.has(row.programKey);

            if (isFirstRowInProgram) {
                renderedProgram.add(row.programKey);
            }

            tableBody.push([
                ...(isFirstRowInProgram ? [{ content: row.programNumber, rowSpan: programRowSpans.get(row.programKey) ?? 1 }] : []),
                `${"    ".repeat(row.hierarchyLevel)}${row.jenisRenja}\n${row.namaRenja !== "-" ? `(${row.namaRenja})` : "-"}\n(${row.kodeRenja || "-"})`,
                row.indikator || "-",
                target?.target || "-",
                target?.realisasi ?? "-",
                formatPercentageText(target?.capaian || "-"),
                formatPercentageText(target?.keteranganCapaian || "-"),
                target?.pagu != null ? target.pagu.toLocaleString() : "-",
                target?.realistasiPagu != null ? target.realistasiPagu.toLocaleString() : "-",
                formatPercentageText(target?.capaianPagu || "-"),
                formatPercentageText(target?.keteranganCapaianPagu || "-"),
                target?.faktorPenunjang || "-",
                target?.faktorPenghambat || "-",
            ]);
        });

        autoTable(doc, {
            head: tableHead,
            body: tableBody,
            startY: 72,
            styles: {
                fontSize: 8,
                cellPadding: 4,
                lineColor: [16, 185, 129],
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
                0: { cellWidth: 26, halign: "center", valign: "middle" },
                1: { cellWidth: 130 },
                2: { cellWidth: 128 },
                3: { cellWidth: 56, halign: "center" },
                4: { cellWidth: 52, halign: "center" },
                5: { cellWidth: 50, halign: "center" },
                6: { cellWidth: 150, halign: "center" },
                7: { cellWidth: 62, halign: "center" },
                8: { cellWidth: 68, halign: "center" },
                9: { cellWidth: 54, halign: "center" },
                10: { cellWidth: 150, halign: "center" },
                11: { cellWidth: 110, halign: "center" },
                12: { cellWidth: 110, halign: "center" },
            },
            tableWidth: "wrap",
            margin: { top: 72, right: 40, bottom: 40, left: 40 },
            theme: "grid",
            didParseCell: (data) => {
                if (data.section !== "body" || data.column.index !== 1) return;

                const row = rows[data.row.index];
                if (!row) return;

                const { fillColor, textColor } = getHierarchyCellColorForPdf(row.jenisRenja);
                if (fillColor) {
                    data.cell.styles.fillColor = fillColor;
                }
                if (textColor) {
                    data.cell.styles.textColor = textColor;
                }
            },
        });

        const safeMonthLabel = String(bulanName || "bulan").replace(/\s+/g, "-").toLowerCase();
        const safeYearLabel = String(activatedTahun || "tahun").replace(/\s+/g, "-").toLowerCase();
        const fileName = `renja-opd-${safeYearLabel}-${safeMonthLabel}.pdf`;
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

    const handleCloseFaktorTarget = () => {
        setSelectedFaktorTarget(null);
    };

    const jenisRenjaHeader = rows.find((row) => row.jenisRenja && row.jenisRenja !== "-")?.jenisRenja;
    const headerColor = getHeaderColorByJenisRenja(jenisRenjaHeader);
    const headerFillColor = getHeaderFillColorByJenisRenja(jenisRenjaHeader);

    useEffect(() => {
        return () => {
            if (pdfPreviewUrl) {
                URL.revokeObjectURL(pdfPreviewUrl);
            }
        };
    }, [pdfPreviewUrl]);

    if (loading) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center">
                <LoadingBeat loading={true} />
                <p className="text-sm text-gray-600 mt-2">
                    Memuat data renja OPD...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded border border-red-200 px-4 py-6 text-center text-sm text-red-600">
                Error: {error}
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="rounded border border-sky-200 px-4 py-6 text-center text-sm text-gray-600">
                Data renja OPD tidak ada.
            </div>
        );
    }

    return (
        <>

            <div className="overflow-auto m-2 rounded-t-xl">
                <table id="print-area-renja" className="w-full">
                    <thead>
                        <tr className={`text-xm ${headerColor}`}>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[180px]">Program/Kegiatan/Subkegiatan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Indikator</td>
                            <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">{`Renja Target ${activatedTahun || ""} - ${bulanName || ""}`}</th>
                            <th colSpan={4} className="border-l border-b px-6 py-3 min-w-[100px]">{`Renja Pagu ${activatedTahun || ""} - ${bulanName || ""}`}</th>
                            <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[160px] text-center">Faktor Penunjang</th>
                            <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[160px] text-center">Faktor Penghambat</th>
                            <th rowSpan={2} className="border-l border-b px-6 py-3 min-w-[120px] text-center">Aksi</th>
                        </tr>
                        <tr className={headerColor}>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Target (%)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Realisasi (%)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Capaian (%)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Pagu (Rp.)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Realisasi (Rp.)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[80px]">Capaian (Rp.)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                        {(() => {
                            const target = row.targets[0];
                            const isFirstRowInProgram = firstRowIdByProgram.get(row.programKey) === row.id;
                            const isRealisasiFilled = target?.realisasi !== null && target?.realisasi !== undefined && Number(target.realisasi) !== 0;

                            return (
                                <>
                                            {isFirstRowInProgram && (
                                                <td rowSpan={programRowSpans.get(row.programKey) ?? 1} className="border-x border-b border-sky-600 py-4 px-3 text-center align-middle font-semibold">
                                                    {row.programNumber}
                                                </td>
                                            )}
                                            <td className={`border-r border-b border-sky-600 px-6 py-4 align-top ${getHierarchyCellColorClass(row.jenisRenja)}`}>
                                                <div className={`flex flex-col gap-1 ${getHierarchyIndentClass(row.hierarchyLevel)}`}>
                                                    <span className="font-semibold">{row.jenisRenja || "-"}</span>
                                                    <span className="text-sm font-medium leading-relaxed">{row.namaRenja !== "-" ? `(${row.namaRenja})` : "-"}</span>
                                                    <span className={`text-xs ${row.jenisRenja === "Subkegiatan" ? "text-slate-700" : "text-white/90"}`}>({row.kodeRenja || "-"})</span>
                                                </div>
                                            </td>
                                            <td className="border-r border-b border-sky-600 px-6 py-4 whitespace-pre-line align-top">
                                                {row.indikator || "-"}
                                            </td>
                                            {target ? (
                                                <>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        {target.target || "-"}
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        <span>{target.realisasi ?? "-"}</span>
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        {formatPercentageText(target.capaian || "-")}
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        {formatPercentageText(target.keteranganCapaian || "-")}
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        {target.pagu != null ? target.pagu.toLocaleString() : "-"}
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        <span>{target.realistasiPagu != null ? target.realistasiPagu.toLocaleString() : "-"}</span>
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        {formatPercentageText(target.capaianPagu || "-")}
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        {formatPercentageText(target.keteranganCapaianPagu || "-")}
                                                    </td>
                                                </>
                                            ) : (
                                                <td className="border-r border-b border-sky-600 px-6 py-4 text-center italic text-gray-500" colSpan={10}>
                                                    Tidak ada target di tahun {activatedTahun || "-"}
                                                </td>
                                            )}
                                            {target && (
                                                <>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        <FaktorCell
                                                            value={target.faktorPenunjang}
                                                            isRealisasiFilled={isRealisasiFilled}
                                                            onEdit={() => setSelectedFaktorTarget({ target, jenis: "penunjang" })}
                                                        />
                                                    </td>
                                                    <td className="border-r border-b border-sky-600 px-6 py-4 align-top">
                                                        <FaktorCell
                                                            value={target.faktorPenghambat}
                                                            isRealisasiFilled={isRealisasiFilled}
                                                            onEdit={() => setSelectedFaktorTarget({ target, jenis: "penghambat" })}
                                                        />
                                                    </td>
                                                </>
                                            )}
                                            {isFirstRowInProgram && (
                                                <td rowSpan={programRowSpans.get(row.programKey) ?? 1} className="border-x border-b border-sky-600 px-6 py-4 text-center align-middle">
                                                    <ButtonGreenBorder onClick={handleOpenPrintPreview}>
                                                        Cetak
                                                    </ButtonGreenBorder>
                                                </td>
                                            )}
                                        </>
                                    );
                                })()}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isPrintPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={handleClosePrintPreview}
                    ></div>
                    <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
                        <div className="mb-3 border-b pb-2">
                            <h2 className="text-lg font-semibold uppercase">Preview Cetak Renja OPD</h2>
                            <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
                        </div>

                        <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
                            {pdfPreviewUrl ? (
                                <iframe
                                    title="Preview PDF Renja OPD"
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
            {selectedFaktorTarget?.jenis === "penunjang" && selectedFaktorTarget.target && (
                <FormModal
                    isOpen={true}
                    onClose={handleCloseFaktorTarget}
                    title={`Faktor Penunjang - ${selectedFaktorTarget.target.indikator}`}
                >
                    <FormFaktorPenunjangRenjaOpd
                        kodeOpd={kodeOpd ?? ""}
                        kodeRenja={selectedFaktorTarget.target.kodeRenja}
                        jenisRenja={selectedFaktorTarget.target.jenisRenja}
                        kodeIndikator={selectedFaktorTarget.target.indikatorId}
                        kodeTarget={selectedFaktorTarget.target.targetId}
                        tahun={String(activatedTahun ?? "")}
                        bulan={bulanName ?? ""}
                        currentValue={selectedFaktorTarget.target.faktorPenunjang ?? ""}
                        onClose={handleCloseFaktorTarget}
                        onSuccess={() => {
                            handleCloseFaktorTarget();
                            refetch();
                        }}
                    />
                </FormModal>
            )}
            {selectedFaktorTarget?.jenis === "penghambat" && selectedFaktorTarget.target && (
                <FormModal
                    isOpen={true}
                    onClose={handleCloseFaktorTarget}
                    title={`Faktor Penghambat - ${selectedFaktorTarget.target.indikator}`}
                >
                    <FormFaktorPenghambatRenjaOpd
                        kodeOpd={kodeOpd ?? ""}
                        kodeRenja={selectedFaktorTarget.target.kodeRenja}
                        jenisRenja={selectedFaktorTarget.target.jenisRenja}
                        kodeIndikator={selectedFaktorTarget.target.indikatorId}
                        kodeTarget={selectedFaktorTarget.target.targetId}
                        tahun={String(activatedTahun ?? "")}
                        bulan={bulanName ?? ""}
                        currentValue={selectedFaktorTarget.target.faktorPenghambat ?? ""}
                        onClose={handleCloseFaktorTarget}
                        onSuccess={() => {
                            handleCloseFaktorTarget();
                            refetch();
                        }}
                    />
                </FormModal>
            )}
        </>
    );
};

export default Table;
