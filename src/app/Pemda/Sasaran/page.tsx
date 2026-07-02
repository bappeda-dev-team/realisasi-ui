"use client";

import { LoadingBeat } from "@/components/Global/Loading";
import { useFetchData } from "@/hooks/useFetchData";
import React, { useEffect, useMemo, useState } from "react";
import { useFilterContext } from "@/context/FilterContext";
import { useUserContext } from "@/context/UserContext";
import { getMonthKey, getMonthName } from "@/lib/months";
import { canEditPemdaRealisasi } from "@/lib/rbac";
import {
  RealisasiSasaranResponse,
  SasaranPemdaRealisasiGrouped,
  TargetRealisasiCapaianSasaran,
} from "@/types";
import TableSasaran from "./_components/TableSasaran";
import { FormModal } from "@/components/Global/Modal";
import FormRealisasiSasaranPemda from "./_components/FormRealisasiSasaranPemda";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPercentageText } from "@/lib/formatPercentageText";
import Select from "react-select";
import { getSessionId } from "@/lib/session";

const SasaranPage = () => {
  const { user } = useUserContext();
  const { activatedTahun: selectedTahun, activatedBulan, namaDinas } = useFilterContext();
  const canEdit = canEditPemdaRealisasi(user);
  const selectedTahunNum = selectedTahun ? parseInt(selectedTahun) : 2025;
  const bulanKey = getMonthKey(activatedBulan ?? null);
  const bulanName = getMonthName(activatedBulan ?? null);

  const {
    data: realisasiData,
    loading: realisasiLoading,
    error: realisasiError,
    refetch: refetchRealisasi,
  } = useFetchData<RealisasiSasaranResponse>({
    url: selectedTahun && bulanKey ? `/api/v1/realisasi/sasarans/by-tahun/${selectedTahun}/by-bulan/${encodeURIComponent(bulanKey)}` : null,
  });

  const [OpenModal, setOpenModal] = useState<boolean>(false);
  const [SelectedSasaran, setSelectedSasaran] = useState<
    TargetRealisasiCapaianSasaran[]
  >([]);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState("sasaran-pemda.pdf");
  const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);
  const [selectedLaporanOption, setSelectedLaporanOption] = useState<{ label: string; value: string } | null>(null);

  const targetRealisasiCapaian = useMemo<TargetRealisasiCapaianSasaran[]>(() => {
    return (realisasiData ?? []).map((item) => ({
      targetRealisasiId: item.id ?? null,
      sasaranPemda: item.sasaran ?? "-",
      sasaranId: String(item.sasaranId),
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

  const groupedSasaranPemda = useMemo<SasaranPemdaRealisasiGrouped[]>(() => {
    const sasaranMap = new Map<string, SasaranPemdaRealisasiGrouped>();

    targetRealisasiCapaian.forEach((item) => {
      const sasaranKey = item.sasaranId;
      const indikatorKey = item.indikatorId;

      let sasaran = sasaranMap.get(sasaranKey);
      if (!sasaran) {
        sasaran = {
          sasaranId: sasaranKey,
          sasaranPemda: item.sasaranPemda,
          indikator: [],
        };
        sasaranMap.set(sasaranKey, sasaran);
      }

      let indikator = sasaran.indikator.find((row) => row.id === indikatorKey);
      if (!indikator) {
        indikator = {
          id: indikatorKey,
          indikator: item.indikator,
          rumusPerhitungan: item.rumusPerhitungan,
          sumberData: item.sumberData,
          targets: [],
        };
        sasaran.indikator.push(indikator);
      }

      indikator.targets.push(item);
    });

    return Array.from(sasaranMap.values());
  }, [targetRealisasiCapaian]);

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  if (realisasiLoading)
    return <LoadingBeat loading={realisasiLoading} />;
  if (realisasiError)
    return <div>Error fetching realisasi: {realisasiError}</div>;

  if (groupedSasaranPemda.length === 0) {
    return (
      <div className="rounded border border-red-200 px-4 py-6 text-center text-sm text-gray-600">
        Data sasaran pemda tidak ada.
      </div>
    );
  }

  if (!selectedTahun || !activatedBulan || !bulanKey || !bulanName) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Pilih dan aktifkan periode, tahun, dan bulan agar data sasaran pemda muncul.
      </div>
    );
  }

  // modal logic
  const handleOpenModal = (dataTargetRealisasi: TargetRealisasiCapaianSasaran[]) => {
    if (!canEdit) return;
    setSelectedSasaran(dataTargetRealisasi);
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
      format: "a4",
    });

    const periodLabel = `${selectedTahunNum} - ${bulanName}`;

    doc.setFontSize(14);
    doc.text("Sasaran Pemda", 40, 40);
    doc.setFontSize(10);
    doc.text(`Periode: ${periodLabel}`, 40, 58);

    const tableHead = [[
      "No",
      "Sasaran",
      "Indikator",
      "Rumus Perhitungan",
      "Sumber Data",
      "Target (%)",
      "Realisasi (%)",
      "Capaian (%)",
      "Keterangan Capaian",
      "Faktor Penunjang",
      "Faktor Penghambat",
    ]];

    const tableBody: any[] = [];

    groupedSasaranPemda.forEach((sasaran, sasaranIndex) => {
      if (!sasaran.indikator.length) {
        tableBody.push([
          sasaranIndex + 1,
          sanitizeForPdf(sasaran.sasaranPemda),
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
            sanitizeForPdf(formatPercentageText(target.capaian).replace(/%$/, "")),
            sanitizeForPdf(formatPercentageText(target.keteranganCapaian)),
            sanitizeForPdf(target.faktorPenunjang ?? "-"),
            sanitizeForPdf(target.faktorPenghambat ?? "-"),
          ]);
        });
      });

      detailRows.forEach((detailRow, detailIndex) => {
        if (detailIndex === 0) {
          tableBody.push([
            { content: sasaranIndex + 1, rowSpan: detailRows.length },
            { content: sanitizeForPdf(sasaran.sasaranPemda), rowSpan: detailRows.length },
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
        3: { cellWidth: 100 },
        4: { cellWidth: 120 },
        5: { cellWidth: 45, halign: "center" },
        6: { cellWidth: 55, halign: "center" },
        7: { cellWidth: 45, halign: "center" },
        8: { cellWidth: 70 },
        9: { cellWidth: 70 },
        10: { cellWidth: 70 },
      },
      tableWidth: "wrap",
      margin: { top: 72, right: 40, bottom: 40, left: 40 },
      theme: "grid",
    });

    const safeMonthLabel = String(bulanName || "bulan").replace(/\s+/g, "-").toLowerCase();
    const safeYearLabel = String(selectedTahunNum || "tahun").replace(/\s+/g, "-").toLowerCase();
    const fileName = `sasaran-pemda-${safeYearLabel}-${safeMonthLabel}.pdf`;
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

  // LAPORAN REALISASI
  const laporanOptions = [
    { label: 'Bulanan', value: 'BULANAN' },
    { label: 'Triwulan', value: 'TRIWULAN' },
    { label: 'Tahunan', value: 'TAHUNAN' },
  ];

  const handleGenerateLaporan = async (jenisLaporan: string) => {
    const baseUrl = `/api/v1/realisasi/sasarans/laporan/tahun/${selectedTahunNum}/jenisLaporan/${jenisLaporan}`;
    const url = jenisLaporan === 'BULANAN'
      ? `${baseUrl}?bulan=${bulanKey}`
      : baseUrl;

    const sessionId = getSessionId();
    if (!sessionId) return;

    const res = await fetch(url, {
      headers: { 'X-Session-Id': sessionId },
    });
    if (!res.ok) return;
    const data = await res.json();

    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a3' });
    doc.setFontSize(14);
    doc.text(`Laporan Realisasi Sasaran Pemda - ${jenisLaporan} - ${namaDinas}`, 40, 40);

    doc.text(`Tahun: ${selectedTahunNum}`, 40, 58);

    const entries = Object.entries(data.listData as Record<string, number>);
    const periodLabel = jenisLaporan === 'TRIWULAN' ? 'Triwulan' : 'Bulan';
    const tableBody = entries.map(([key, value]) => [
      `${periodLabel} ${key}`,
      String(value),
    ]);

    autoTable(doc, {
      head: [['Periode', 'Realisasi (%)']],
      body: tableBody,
      startY: 72,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
      columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 80, halign: 'center' } },
      theme: 'grid',
    });

    const previewUrl = String(doc.output('bloburl'));
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
    }
    setPreviewDoc(doc);
    setPdfFileName(`laporan-realisasi-${jenisLaporan.toLowerCase()}-${selectedTahunNum}.pdf`);
    setPdfPreviewUrl(previewUrl);
    setIsPrintPreviewOpen(true);
  };

  return (
    <div className="overflow-auto grid gap-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Realisasi Sasaran Pemda</h2>
        <Select
          value={selectedLaporanOption}
          options={laporanOptions}
          placeholder="Laporan Realisasi"
          isSearchable={false}
          onChange={(opt) => {
            setSelectedLaporanOption(opt);
            if (opt) handleGenerateLaporan(opt.value);
          }}
          formatOptionLabel={(option, { context }) =>
            context === 'value' ? `Laporan Realisasi : ${option.label}` : option.label
          }
          styles={{
            control: (base) => ({
              ...base,
              background: "linear-gradient(to right, #08C2FF, #006BFF)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              minHeight: 38,
              cursor: "pointer",
              boxShadow: "none",
            }),
            singleValue: (base) => ({ ...base, color: "#fff" }),
            placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.8)" }),
            dropdownIndicator: (base) => ({ ...base, color: "#fff" }),
            indicatorSeparator: () => ({ display: "none" }),
            menu: (base) => ({ ...base, zIndex: 20, minWidth: 180 }),
          }}
        />
      </div>
      <div className="mt-2 rounded-t-lg border border-red-400">
        <TableSasaran
          tahun={selectedTahunNum}
          bulanLabel={bulanName}
          sasaranPemda={groupedSasaranPemda}
          canEdit={canEdit}
          handleOpenPrintPreview={handleOpenPrintPreview}
          handleOpenModal={handleOpenModal}
          bulanKey={bulanKey}
          onFaktorSuccess={() => refetchRealisasi()}
        />
        {canEdit && (
          <FormModal
            isOpen={OpenModal}
            onClose={() => {
              setOpenModal(false);
            }}
            title={`Realisasi Sasaran Pemda - ${selectedTahunNum} - ${bulanName} - ${SelectedSasaran[0]?.sasaranPemda ?? ""}`}
          >
            <FormRealisasiSasaranPemda
              requestValues={SelectedSasaran}
              tahun={selectedTahunNum}
              bulan={bulanKey}
              bulanLabel={bulanName}
              onClose={() => {
                setOpenModal(false);
              }}
              onSuccess={() => {
                setOpenModal(false);
                refetchRealisasi();
              }}
            />
          </FormModal>
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
              <h2 className="text-lg font-semibold uppercase">Preview Cetak Sasaran Pemda</h2>
              <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
            </div>

            <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
              {pdfPreviewUrl ? (
                <iframe
                  title="Preview PDF Sasaran Pemda"
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
};

export default SasaranPage;
