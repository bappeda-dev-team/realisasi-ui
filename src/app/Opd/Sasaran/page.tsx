"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { useFilterContext } from "@/context/FilterContext";
import { useFetchData } from "@/hooks/useFetchData";
import { getMonthKey, getMonthName } from "@/lib/months";
import { formatPercentageText } from "@/lib/formatPercentageText";
import {
  SasaranOpdPenetapanResponse,
  SasaranOpdPenetapanGrouped,
  SasaranOpdRealisasiGroupedIndikator,
} from "@/types";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import React, { useEffect, useMemo, useState } from "react";
import TableSasaranOpd from "./_components/TableSasaranOpd";

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

export default function SasaranPage() {
  const { activatedDinas: kodeOpd, activatedTahun: selectedTahun, activatedBulan, namaDinas: namaOpd } =
    useFilterContext();

  const selectedTahunValue = selectedTahun ? parseInt(selectedTahun, 10) : 2025;
  const bulanKey = getMonthKey(activatedBulan);
  const bulanName = getMonthName(activatedBulan) ?? "Bulan";

  const {
    data: penetapanData,
    loading: penetapanLoading,
    error: penetapanError,
  } = useFetchData<SasaranOpdPenetapanResponse>({
    url:
      kodeOpd && selectedTahunValue && bulanKey
        ? `/api/v1/realisasi/sasaran_opd/${kodeOpd}/tahun/${selectedTahunValue}/penetapan?bulan=${encodeURIComponent(bulanKey ?? "")}`
        : null,
  });

  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState("sasaran-opd.pdf");
  const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);

  const groupedSasaranOpd = useMemo<SasaranOpdPenetapanGrouped[]>(() => {
    const sasaranOpds = penetapanData?.sasaranOpds ?? [];
    const topKodeOpd = penetapanData?.kode_opd ?? '';

    const sasaranMap = new Map<string, SasaranOpdPenetapanGrouped>();

    sasaranOpds.forEach((sasaran) => {
      const sasaranKey = sasaran.kode_sasaran_opd;
      const grouped: SasaranOpdPenetapanGrouped = {
        sasaranId: sasaranKey,
        sasaranOpd: sasaran.sasaran_opd,
        indikator: [],
      };

      sasaran.indikators.forEach((ind) => {
        const indikatorItem: SasaranOpdRealisasiGroupedIndikator = {
          id: ind.kode_indikator,
          indikator: ind.indikator,
          rumusPerhitungan: ind.rumus_perhitungan ?? '-',
          sumberData: ind.sumber_data ?? '-',
          targets: [],
        };

        ind.targets.forEach((tgt) => {
          indikatorItem.targets.push({
            targetRealisasiId: null,
            renja: sasaran.sasaran_opd,
            renjaId: sasaranKey,
            sasaranOpd: sasaran.sasaran_opd,
            sasaranId: sasaranKey,
            indikatorId: ind.kode_indikator,
            indikator: ind.indikator,
            targetId: tgt.kode_target,
            target: String(tgt.target),
            realisasi: tgt.realisasi ?? 0,
            capaian: tgt.capaian != null ? String(tgt.capaian) : '-',
            keteranganCapaian: tgt.keterangan_capaian ?? '-',
            satuan: tgt.satuan,
            tahun: String(selectedTahunValue),
            kodeOpd: topKodeOpd,
            rumusPerhitungan: ind.rumus_perhitungan ?? '-',
            sumberData: ind.sumber_data ?? '-',
          });
        });

        grouped.indikator.push(indikatorItem);
      });

      sasaranMap.set(sasaranKey, grouped);
    });

    return Array.from(sasaranMap.values());
  }, [penetapanData, selectedTahunValue]);

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  if (!kodeOpd) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Silakan pilih OPD terlebih dahulu untuk melihat data sasaran OPD.
      </div>
    );
  }

  if (!selectedTahun || !bulanKey) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Pilih dan aktifkan tahun dan bulan agar data sasaran OPD muncul.
      </div>
    );
  }

  if (penetapanLoading) {
    return (
      <div className="rounded border border-emerald-200 px-4 py-6 text-center">
        <LoadingBeat loading={true} />
        <p className="text-sm text-gray-600 mt-2">Memuat data sasaran OPD...</p>
      </div>
    );
  }

  if (penetapanError) {
    return (
      <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
        Error: {penetapanError}
      </div>
    );
  }

  if (!groupedSasaranOpd.length) {
    return (
      <div className="rounded border border-emerald-200 px-4 py-6 text-center text-sm text-gray-600">
        Data sasaran OPD tidak ada.
      </div>
    );
  }

  const createPdfDocument = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const periodLabel = `${selectedTahunValue} - ${bulanName}`;
    const opdTitle = namaOpd ? ` - ${namaOpd}` : "";

    doc.setFontSize(14);
    doc.text(`Sasaran OPD${opdTitle}`, 40, 40);
    doc.setFontSize(10);
    doc.text(`Periode: ${periodLabel}`, 40, 58);

    const tableHead = [[
      "No",
      "Sasaran",
      "Indikator",
      "Rumus Perhitungan",
      "Sumber Data",
      "Target",
      "Realisasi (%)",
      "Capaian",
      "Keterangan Capaian",
    ]];

    const tableBody: any[] = [];

    groupedSasaranOpd.forEach((sasaran, sasaranIndex) => {
      const detailRows: Array<Array<string | number>> = [];

      if (!sasaran.indikator.length) {
        detailRows.push(["-", "-", "-", "-", "-", "-", "-", "-"]);
      } else {
        sasaran.indikator.forEach((indikator) => {
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
            { content: sasaranIndex + 1, rowSpan: detailRows.length },
            { content: sanitizeForPdf(sasaran.sasaranOpd), rowSpan: detailRows.length },
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
        1: { cellWidth: 150 },
        2: { cellWidth: 100 },
        3: { cellWidth: 200 },
        4: { cellWidth: 50, halign: "center" },
        5: { cellWidth: 50, halign: "center" },
        6: { cellWidth: 55, halign: "center" },
        7: { cellWidth: 50, halign: "center" },
        8: { cellWidth: 70 },
      },
      tableWidth: "wrap",
      margin: { top: 72, right: 40, bottom: 40, left: 40 },
      theme: "grid",
    });

    const safeMonthLabel = String(bulanName || "bulan").replace(/\s+/g, "-").toLowerCase();
    const safeYearLabel = String(selectedTahunValue || "tahun").replace(/\s+/g, "-").toLowerCase();
    const fileName = `sasaran-opd-${safeYearLabel}-${safeMonthLabel}.pdf`;

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
      <h2 className="text-lg font-semibold mb-2">Realisasi Sasaran OPD - {namaOpd ?? "-"}</h2>
      <TableSasaranOpd
        tahun={selectedTahunValue}
        bulanLabel={bulanName}
        sasaranOpd={groupedSasaranOpd}
        handleOpenPrintPreview={handleOpenPrintPreview}
      />
      {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={handleClosePrintPreview}></div>
          <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 border-b pb-2">
              <h2 className="text-lg font-semibold uppercase">Preview Cetak Sasaran OPD</h2>
              <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
            </div>

            <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
              {pdfPreviewUrl ? (
                <iframe title="Preview PDF Sasaran OPD" src={pdfPreviewUrl} className="h-full w-full" />
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
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
