'use client'

import React, { useEffect, useState } from 'react'
import { LoadingBeat } from '@/components/Global/Loading'
import { useFilterContext } from '@/context/FilterContext'
import { useFetchData } from '@/hooks/useFetchData'
import { getMonthName } from '@/lib/months'
import { ButtonGreenBorder } from "@/components/Global/Button/button";
import { RenaksiIndividuResponse, RenaksiTarget } from '@/types'
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RenaksiRow {
  id: number
  renaksi: string
  nama_pegawai: string
  nip: string
  rekin: string
  targets: RenaksiTarget[]
}

const Table = () => {
  const [rows, setRows] = useState<RenaksiRow[]>([])
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>("renaksi-OPD.pdf");
  const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null);

  const { activatedDinas: kodeOpd, activatedTahun, activatedBulan, namaDinas } = useFilterContext()

  const monthLabel = getMonthName(activatedBulan)
  const apiUrl =
    kodeOpd && activatedTahun && monthLabel
      ? `/api/v1/realisasi/renaksi/by-kodeOpd/${encodeURIComponent(kodeOpd)}/by-tahun/${encodeURIComponent(activatedTahun)}/by-bulan/${encodeURIComponent(monthLabel)}`
      : null

  const { data, loading, error } = useFetchData<RenaksiIndividuResponse[]>({
    url: apiUrl,
  })

  useEffect(() => {
    if (!data) {
      setRows([])
      return
    }

    const groupedByNip = new Map<string, RenaksiIndividuResponse[]>()

    data.forEach((item) => {
      const nipKey = item.nip || 'unknown'
      const existing = groupedByNip.get(nipKey) || []
      groupedByNip.set(nipKey, [...existing, item])
    })

    const newRows: RenaksiRow[] = []

    groupedByNip.forEach((items, nipKey) => {
      const firstItem = items[0]
      const namaPegawai = firstItem.nip || '-'

      const targets: RenaksiTarget[] = items.map((item) => ({
        targetRealisasiId: item.id ?? null,
        renaksiId: item.renaksiId,
        renaksi: item.renaksi ?? '-',
        nip: item.nip ?? '-',
        rekinId: item.rekinId,
        rekin: item.rekin ?? '-',
        targetId: item.targetId,
        target: item.target,
        realisasi: item.realisasi,
        satuan: item.satuan,
        tahun: item.tahun,
        bulan: item.bulan,
        jenisRealisasi: item.jenisRealisasi,
        capaian: item.capaian ?? '-',
        keteranganCapaian: item.keteranganCapaian ?? '-',
        rencanaKinerja: item.rekin,
      }))

      newRows.push({
        id: firstItem.id,
        renaksi: firstItem.renaksi ?? '-',
        nama_pegawai: namaPegawai,
        nip: nipKey,
        rekin: firstItem.rekin ?? '-',
        targets,
      })
    })

    setRows(newRows)
  }, [data])

  const createPdfDocument = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    const periodLabel = `${monthColumnLabel}`;
    const opdTitle = namaDinas ? ` - ${namaDinas}` : "";

    doc.setFontSize(14);
    doc.text(`Renaksi OPD${opdTitle}`, 40, 40);
    doc.setFontSize(10);
    doc.text(`Periode: ${periodLabel}`, 40, 58);

    const tableHead = [[
      "No",
      "Rencana Kinerja",
      "Nama Pemilik",
      "Rencana Aksi",
      "Target",
      "Realisasi",
      "Satuan",
      "Capaian",
      "Keterangan Capaian",
    ]];

    const tableBody: any[] = [];

    rows.forEach((item, index) => {
      const targets = item.targets.length ? item.targets : [null];

      targets.forEach((target, targetIndex) => {
        const detailRow = [
          target?.target || "-",
          target?.realisasi ?? "-",
          target?.satuan || "-",
          target?.capaian || "-",
          target?.keteranganCapaian || "-",
        ];

        if (targetIndex === 0) {
          tableBody.push([
            { content: index + 1, rowSpan: targets.length },
            { content: item.rekin || "-", rowSpan: targets.length },
            { content: `${item.nama_pegawai || "-"} (${item.nip || "-"})`, rowSpan: targets.length },
            { content: item.renaksi || "-", rowSpan: targets.length },
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
        cellPadding: 4,
        lineColor: [16, 185, 129],
        lineWidth: 0.5,
        textColor: [31, 41, 55],
        valign: "top",
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        // Header uses green fill; make grid lines visible.
        lineColor: [255, 255, 255],
        lineWidth: 0.5,
      },
      tableWidth: "auto",
      margin: { top: 72, right: 40, bottom: 40, left: 40 },
      theme: "grid",
    });

    const safeMonthLabel = String(activatedBulan || "bulan").replace(/\s+/g, "-").toLowerCase();
    const safeYearLabel = String(activatedTahun || "tahun").replace(/\s+/g, "-").toLowerCase();
    const fileName = `renaksi-individu-${safeYearLabel}-${safeMonthLabel}.pdf`;
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

  const monthColumnLabel = activatedTahun && monthLabel
    ? `${activatedTahun} - ${monthLabel}`
    : 'Bulan'

  const infoMessage = !kodeOpd
    ? 'Silakan pilih OPD terlebih dahulu untuk melihat data renaksi OPD.'
    : !monthLabel
      ? 'Pilih dan aktifkan bulan agar data renaksi OPD muncul.'
      : undefined

  if (infoMessage) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        {infoMessage}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded border border-emerald-200 px-4 py-6 text-center">
        <LoadingBeat loading={true} />
        <p className="text-sm text-gray-600 mt-2">Memuat data renaksi OPD...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
        Gagal memuat data renaksi: {error}
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="rounded border border-emerald-200 px-4 py-6 text-center text-sm text-gray-600">
        Data renaksi untuk {monthLabel} belum tersedia.
      </div>
    )
  }

  return (
    <div className="overflow-auto m-2 rounded-t-xl">
      <table id="print-area-renaksi" className="w-full">
        <thead>
          <tr className="text-xm bg-emerald-500 text-white">
            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">
              No
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">
              Rencana Aksi
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">
              Nama Pemilik
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[180px]">
              Rencana Kinerja
            </td>
            <th colSpan={5} className="border-l border-b px-6 py-3 min-w-[100px]">
              {monthColumnLabel}
            </th>
            <td
              rowSpan={2}
              className="border-l border-b px-6 py-3 min-w-[120px] text-center"
            >
              Aksi
            </td>
          </tr>
          <tr className="bg-emerald-500 text-white">
            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
            <th className="border-l border-b px-6 py-3 min-w-[50px]">Realisasi</th>
            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
            <th className="border-l border-b px-6 py-3 min-w-[50px]">Capaian</th>
            <th className="border-l border-b px-6 py-3 min-w-[150px]">Keterangan Capaian</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const target = row.targets[0]
            return (
              <tr key={row.id}>
                <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                  {index + 1}
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {row.renaksi || '-'}
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {row.nama_pegawai || '-'} ({row.nip || '-'})
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {row.rekin || '-'}
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {target?.target || '-'}
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {target?.realisasi ?? '-'}
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {target?.satuan || '-'}
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {target?.capaian || '-'}
                </td>
                <td className="border-r border-b border-emerald-500 px-6 py-4">
                  {target?.keteranganCapaian || '-'}
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
            )
          })}
        </tbody>
      </table>

      {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={handleClosePrintPreview}
          ></div>
          <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 border-b pb-2">
              <h2 className="text-lg font-semibold uppercase">Preview Cetak Renaksi OPD</h2>
              <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
            </div>

            <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
              {pdfPreviewUrl ? (
                <iframe
                  title="Preview PDF Renaksi OPD"
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

export default Table
