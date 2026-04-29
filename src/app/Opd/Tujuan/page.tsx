"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { FormModal } from "@/components/Global/Modal";
import { useFetchData } from "@/hooks/useFetchData";
import { useFilterContext } from "@/context/FilterContext";
import { getMonthName } from "@/lib/months";
import {
  TujuanOpdPerencanaan,
  TujuanOpdPerencanaanResponse,
  TujuanOpdRealisasiResponse,
  TujuanOpdTargetRealisasiCapaian,
} from "@/types";
import React, { useEffect, useState } from "react";
import FormRealisasiTujuanOpd from "./_components/FormRealisasiTujuanOpd";
import TableTujuanOpd from "./_components/TableTujuanOpd";
import { gabunganDataPerencanaanRealisasi } from "./_lib/gabunganDataPerencanaanRealisasi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function TujuanPage() {
  const { activatedDinas: kodeOpd, activatedTahun: selectedTahun, activatedBulan, bulan } = useFilterContext();
  const selectedTahunValue = selectedTahun ? parseInt(selectedTahun) : 2025;
  const bulanName = getMonthName(activatedBulan) ?? getMonthName(bulan ?? null) ?? "Bulan";
  const periode = [2025, 2026, 2027, 2028, 2029, 2030];
  const tahunAwal = periode[0];
  const tahunAkhir = periode[periode.length - 1];
  const jenisPeriode = "rpjmd";
  const {
    data: tujuanOpdData,
    loading: perencanaanLoading,
    error: perencanaanError,
  } = useFetchData<TujuanOpdPerencanaanResponse>({
    url: kodeOpd ? `/api/perencanaan/tujuan_opd/findall/${kodeOpd}/tahunawal/${tahunAwal}/tahunakhir/${tahunAkhir}/jenisperiode/${jenisPeriode}` : null,
  });
const {
    data: realizationData,
    loading: realizationLoading,
    error: realizationError,
    refetch: refetchRealization,
  } = useFetchData<TujuanOpdRealisasiResponse>({
    url: kodeOpd && selectedTahunValue && bulanName ? `/api/v1/realisasi/tujuan_opd/${kodeOpd}/tahun/${selectedTahunValue}/bulan/${encodeURIComponent(bulanName)}` : null,
  });
  const [TargetRealisasiCapaian, setTargetRealisasiCapaian] = useState<
    TujuanOpdTargetRealisasiCapaian[]
  >([]);
  const [PerencanaanTujuanOpd, setPerencanaanTujuanOpd] = useState<
    TujuanOpdPerencanaan[]
  >([]);
  const [NamaOpd, setNamaOpd] = useState<string>("");
  const [OpenModal, setOpenModal] = useState<boolean>(false);
  const [TujuanOpdSelected, setTujuanOpdSelected] = useState<
    TujuanOpdTargetRealisasiCapaian[]
  >([]);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState("tujuan-opd.pdf");
  const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);

  useEffect(() => {
    if (tujuanOpdData?.data && realizationData && kodeOpd) {
      const perencanaan = tujuanOpdData.data;
      setPerencanaanTujuanOpd(perencanaan[0].tujuan_opd);

      setNamaOpd(perencanaan[0].nama_opd);

      const combinedData = gabunganDataPerencanaanRealisasi(
        perencanaan[0].tujuan_opd,
        realizationData,
        kodeOpd,
      );
      setTargetRealisasiCapaian(combinedData);
    } else {
      setNamaOpd("");
      setTargetRealisasiCapaian([]);
      setPerencanaanTujuanOpd([]);
    }
  }, [tujuanOpdData, realizationData, kodeOpd]);

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  if (perencanaanLoading || realizationLoading)
    return <LoadingBeat loading={perencanaanLoading} />;
  if (perencanaanError)
    return <div>Error fetching perencanaan: {perencanaanError}</div>;
  if (realizationError)
    return <div>Error fetching realistasi: {realizationError}</div>;

  if (!kodeOpd || !selectedTahun || !bulanName) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih OPD, tahun, dan bulan dahulu
      </div>
    );
  }

  const handleOpenModal = (
    tujuan: TujuanOpdPerencanaan,
    dataTargetRealisasi: TujuanOpdTargetRealisasiCapaian[],
  ) => {
    setTujuanOpdSelected(dataTargetRealisasi);
    setOpenModal(true);
  };

  const sanitizeForPdf = (value: unknown) => {
    if (value == null) return "-";
    let text = String(value);

    // Normalize to reduce odd Unicode representations.
    try {
      text = text.normalize("NFKC");
    } catch {
      // ignore if environment doesn't support normalize
    }

    // Replace common math symbols that often break jsPDF's built-in fonts.
    text = text
      .replace(/\u2265/g, ">=") // ≥
      .replace(/\u2264/g, "<=") // ≤
      .replace(/\u00b1/g, "+/-"); // ±

    // Remove zero-width / bidi controls that can cause spacing artifacts.
    text = text.replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, "");

    // Collapse whitespace.
    text = text.replace(/\s+/g, " ").trim();

    return text.length ? text : "-";
  };

  const createPdfDocument = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const periodLabel = `${selectedTahunValue} - ${bulanName}`;
    const opdTitle = NamaOpd ? ` - ${NamaOpd}` : "";

    doc.setFontSize(14);
    doc.text(`Tujuan OPD${opdTitle}`, 40, 40);
    doc.setFontSize(10);
    doc.text(`Periode: ${periodLabel}`, 40, 58);

    const tableHead = [[
      "No",
      "Tujuan",
      "Indikator",
      "Rumus Perhitungan",
      "Sumber Data",
      "Target",
      "Realisasi",
      "Satuan",
      "Capaian",
      "Keterangan Capaian",
    ]];

    const tableBody: any[] = [];

    PerencanaanTujuanOpd.forEach((tujuan, tujuanIndex) => {
      const indikatorList = tujuan.indikator ?? [];
      const detailRows: Array<Array<string | number>> = [];

      if (indikatorList.length === 0) {
        detailRows.push(["-", "-", "-", "-", "-", "-", "-"]);
      } else {
        indikatorList.forEach((indikator) => {
          const targetsInYear = (indikator.target ?? []).filter(
            (target) => target.tahun === String(selectedTahunValue),
          );

          if (targetsInYear.length === 0) {
            detailRows.push([
              sanitizeForPdf(indikator.indikator),
              sanitizeForPdf(indikator.rumus_perhitungan),
              sanitizeForPdf(indikator.sumber_data),
              "-",
              "-",
              "-",
              "-",
            ]);
            return;
          }

          targetsInYear.forEach((targetPlan) => {
            const realisasi = TargetRealisasiCapaian.find(
              (item) =>
                item.indikatorId === String(indikator.id) &&
                item.targetId === String(targetPlan.id) &&
                item.tahun === String(selectedTahunValue),
            );

            detailRows.push([
              sanitizeForPdf(indikator.indikator),
              sanitizeForPdf(indikator.rumus_perhitungan),
              sanitizeForPdf(indikator.sumber_data),
              sanitizeForPdf(targetPlan.target),
              realisasi?.realisasi ?? 0,
              sanitizeForPdf(realisasi?.satuan || targetPlan.satuan),
              sanitizeForPdf(realisasi?.capaian),
              sanitizeForPdf(realisasi?.keteranganCapaian),
            ]);
          });
        });
      }

      detailRows.forEach((detailRow, detailIndex) => {
        if (detailIndex === 0) {
          tableBody.push([
            { content: tujuanIndex + 1, rowSpan: detailRows.length },
            { content: sanitizeForPdf(tujuan.tujuan), rowSpan: detailRows.length },
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
        2: { cellWidth: 100 },
        3: { cellWidth: 200 },
        4: { cellWidth: 50, halign: "center" },
        5: { cellWidth: 50, halign: "center" },
        6: { cellWidth: 50, halign: "center" },
        7: { cellWidth: 50, halign: "center" },
        8: { cellWidth: 50, halign: "center" },
        9: { cellWidth: 70 },
      },
      tableWidth: "wrap",
      margin: { top: 72, right: 40, bottom: 40, left: 40 },
      theme: "grid",
    });

    const safeMonthLabel = String(bulanName || "bulan").replace(/\s+/g, "-").toLowerCase();
    const safeYearLabel = String(selectedTahunValue || "tahun").replace(/\s+/g, "-").toLowerCase();
    const fileName = `tujuan-opd-${safeYearLabel}-${safeMonthLabel}.pdf`;
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
      <h2 className="text-lg font-semibold mb-2">
        Realisasi Tujuan OPD - {NamaOpd}
      </h2>
      <TableTujuanOpd
        tahun={selectedTahunValue}
        bulanLabel={bulanName}
        tujuanOpd={PerencanaanTujuanOpd}
        targetRealisasiCapaians={TargetRealisasiCapaian}
        handleOpenPrintPreview={handleOpenPrintPreview}
        handleOpenModal={handleOpenModal}
      />
      <FormModal
        isOpen={OpenModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title={`Realisasi Tujuan OPD - ${TujuanOpdSelected[0]?.tujuanOpd || ""}`}
      >
        <FormRealisasiTujuanOpd
          requestValues={TujuanOpdSelected}
          tahun={selectedTahunValue}
          bulanLabel={bulanName}
          onClose={() => {
            setOpenModal(false);
          }}
          onSuccess={() => {
            setOpenModal(false);
            refetchRealization();
          }}
        />
      </FormModal>
      {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={handleClosePrintPreview}
          ></div>
          <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 border-b pb-2">
              <h2 className="text-lg font-semibold uppercase">Preview Cetak Tujuan OPD</h2>
              <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
            </div>

            <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
              {pdfPreviewUrl ? (
                <iframe
                  title="Preview PDF Tujuan OPD"
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
