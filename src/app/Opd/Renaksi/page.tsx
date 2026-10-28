'use client'

import React, { useEffect, useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { TbRefresh } from 'react-icons/tb'
import { ButtonSky } from '@/components/Global/Button/button'
import { LoadingBeat } from '@/components/Global/Loading'
import { useFilterContext } from '@/context/FilterContext'
import { useUserContext } from '@/context/UserContext'
import { useFetchData } from '@/hooks/useFetchData'
import { formatPercentageText } from '@/lib/formatPercentageText'
import { getMonthKey, getMonthName } from '@/lib/months'
import { getSessionId } from '@/lib/session'
import { ROLES } from '@/constants/roles'
import { RenaksiOpdPenetapanResponse } from '@/types'
import Table, { formatRupiah, mapPenetapanToRenaksiRows, type RenaksiRow } from './Table'

const sanitizeForPdf = (value: unknown) => {
  if (value == null || value === '') return '-'
  return String(value).replace(/\s+/g, ' ').trim() || '-'
}

const getTriwulanFromMonth = (bulanKey: string | null): number | null => {
  if (!bulanKey) return null

  const bulan = Number.parseInt(bulanKey, 10)
  if (!Number.isFinite(bulan) || bulan < 1 || bulan > 12) return null

  return Math.ceil(bulan / 3)
}

const hitungCapaianTriwulan = (realisasi: number | null, target: number | null): number | null => {
  if (realisasi == null || target == null || target === 0 || realisasi === 0) return null

  const capaian = (Number(realisasi) / Number(target)) * 100
  return Math.min(capaian, 100)
}

interface PdfTriwulanCell {
  target: number | null
  realisasi: number | null
  capaian: number | null
}

const buildPdfTriwulanCells = (row: RenaksiRow, activeTw: number | null): PdfTriwulanCell[] => {
  return [1, 2, 3, 4].map((tw) => {
    const isActiveTw = activeTw === tw
    const target = 100
    const realisasi = isActiveTw ? row.realisasi : null

    return {
      target,
      realisasi,
      capaian: isActiveTw ? hitungCapaianTriwulan(realisasi, target) : null,
    }
  })
}

export default function RenaksiOpdPage() {
  const { activatedDinas: kodeOpd, activatedTahun, activatedBulan, namaDinas } = useFilterContext()
  const { user } = useUserContext()

  const userLevel = user?.roles?.find((r: string) => r.startsWith('level_'))
  const isSuperAdmin = user?.roles?.includes(ROLES.SUPER_ADMIN)
  const hideSyncButton =
    !isSuperAdmin && !!userLevel && [ROLES.LEVEL_1, ROLES.LEVEL_2, ROLES.LEVEL_3, ROLES.LEVEL_4].includes(userLevel as never)

  const tahunValue = activatedTahun ? String(parseInt(activatedTahun, 10)) : null
  const bulanKey = getMonthKey(activatedBulan)
  const bulanName = getMonthName(activatedBulan) ?? 'Bulan'

  const { data, loading, error, refetch } = useFetchData<RenaksiOpdPenetapanResponse>({
    url:
      kodeOpd && tahunValue && bulanKey
        ? `/api/v1/realisasi/renaksi_opd/${encodeURIComponent(kodeOpd)}/tahun/${encodeURIComponent(tahunValue)}/penetapan?bulan=${encodeURIComponent(bulanKey)}`
        : null,
  })

  const [isSyncing, setIsSyncing] = useState(false)
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [pdfFileName, setPdfFileName] = useState('renaksi-opd.pdf')
  const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null)

  const rows = useMemo(() => mapPenetapanToRenaksiRows(data?.renaksi_opds), [data])

  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl)
      }
    }
  }, [pdfPreviewUrl])

  const handleSync = async () => {
    if (!kodeOpd || !tahunValue || !bulanKey) return

    setIsSyncing(true)
    setSyncError(null)
    try {
      const sessionId = getSessionId()
      const response = await fetch(
        `/api/v1/realisasi/renaksi_opd/${encodeURIComponent(kodeOpd)}/tahun/${encodeURIComponent(tahunValue)}/sync/penetapan?bulan=${encodeURIComponent(bulanKey)}`,
        {
          method: 'POST',
          headers: {
            'X-Session-Id': sessionId ?? '',
          },
        }
      )
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || errorData?.error || 'Gagal melakukan sinkronisasi data renaksi OPD.')
      }
      refetch()
    } catch (err: any) {
      console.error('Error during sync:', err)
      setSyncError(err?.message || 'Terjadi kesalahan saat sinkronisasi data.')
    } finally {
      setIsSyncing(false)
    }
  }

  const createPdfDocument = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: 'a3',
    })

    const opdTitle = namaDinas ? ` - ${namaDinas}` : ''
    const activeTw = getTriwulanFromMonth(bulanKey)

    doc.setFontSize(14)
    doc.text(`Renaksi OPD${opdTitle}`, 40, 40)
    doc.setFontSize(10)
    doc.text(`Periode: ${tahunValue ?? '-'} - ${bulanName}`, 40, 58)

    const tableHead: any[] = [
      [
        { content: 'No', rowSpan: 2 },
        { content: 'Kode Renaksi', rowSpan: 2 },
        { content: 'Rencana Aksi', rowSpan: 2 },
        { content: 'Sasaran Kinerja', rowSpan: 2 },
        { content: 'Subkegiatan', rowSpan: 2 },
        { content: 'Anggaran (Rp)', rowSpan: 2 },
        { content: 'TW1', colSpan: 3 },
        { content: 'TW2', colSpan: 3 },
        { content: 'TW3', colSpan: 3 },
        { content: 'TW4', colSpan: 3 },
        { content: `Keterangan Capaian (${bulanName})`, rowSpan: 2 },
        { content: `Faktor Penunjang (${bulanName})`, rowSpan: 2 },
        { content: `Faktor Penghambat (${bulanName})`, rowSpan: 2 },
        { content: 'Aksi', rowSpan: 2 },
      ],
      [
        'Target (%)',
        'Realisasi (%)',
        'Capaian (%)',
        'Target (%)',
        'Realisasi (%)',
        'Capaian (%)',
        'Target (%)',
        'Realisasi (%)',
        'Capaian (%)',
        'Target (%)',
        'Realisasi (%)',
        'Capaian (%)',
      ],
    ]

    const tableBody: any[] = rows.map((row, index) => {
      const twCells = buildPdfTriwulanCells(row, activeTw)

      return [
        index + 1,
        sanitizeForPdf(row.kodeRencanaAksiOpd),
        sanitizeForPdf(row.namaRenaksi),
        sanitizeForPdf(row.kodeSasaranOpd),
        sanitizeForPdf(
          row.namaSubkegiatan !== '-' ? `${row.namaSubkegiatan} (${row.kodeSubkegiatan})` : row.kodeSubkegiatan
        ),
        sanitizeForPdf(formatRupiah(row.anggaran)),
        ...twCells.flatMap((cell) => [
          sanitizeForPdf(cell.target),
          sanitizeForPdf(cell.realisasi),
          sanitizeForPdf(formatPercentageText(cell.capaian ?? '-')),
        ]),
        sanitizeForPdf(formatPercentageText(row.keteranganCapaian ?? '-')),
        sanitizeForPdf(row.faktorPenunjang),
        sanitizeForPdf(row.faktorPenghambat),
        index === 0 ? 'Cetak' : '-',
      ]
    })

    const columnStyles: Record<number, { halign?: 'left' | 'center' | 'right'; cellWidth?: number }> = {
      0: { cellWidth: 24, halign: 'center' },
      5: { halign: 'right' },
      21: { halign: 'center' },
    }

    for (let columnIndex = 6; columnIndex <= 17; columnIndex += 1) {
      columnStyles[columnIndex] = { halign: 'center' }
    }

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 72,
      styles: {
        fontSize: 7,
        cellPadding: 3,
        lineColor: [16, 185, 129],
        lineWidth: 0.5,
        textColor: [31, 41, 55],
        valign: 'top',
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [16, 185, 129],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
      },
      columnStyles,
      tableWidth: 'auto',
      margin: { top: 72, right: 40, bottom: 40, left: 40 },
      theme: 'grid',
    })

    const safeYearLabel = String(tahunValue || 'tahun').replace(/\s+/g, '-').toLowerCase()
    const safeMonthLabel = String(bulanName || 'bulan').replace(/\s+/g, '-').toLowerCase()

    return { doc, fileName: `renaksi-opd-${safeYearLabel}-${safeMonthLabel}-triwulan.pdf` }
  }

  const handleOpenPrintPreview = () => {
    const { doc, fileName } = createPdfDocument()
    const previewUrl = String(doc.output('bloburl'))

    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl)
    }

    setPreviewDoc(doc)
    setPdfFileName(fileName)
    setPdfPreviewUrl(previewUrl)
    setIsPrintPreviewOpen(true)
  }

  const handleClosePrintPreview = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl)
    }

    setIsPrintPreviewOpen(false)
    setPdfPreviewUrl(null)
    setPreviewDoc(null)
  }

  const handleDownloadPdf = () => {
    if (!previewDoc) return
    previewDoc.save(pdfFileName)
  }

  const renderSyncButton = () => {
    if (hideSyncButton) return null

    return (
      <div className="flex justify-end mb-2 mr-2 mt-2">
        <ButtonSky
          className="px-5 py-2 text-base font-medium"
          onClick={() => setIsSyncModalOpen(true)}
          disabled={isSyncing || loading}
        >
          {isSyncing ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Syncing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <TbRefresh size={20} />
              <span>Sinkronisasi Penetapan</span>
            </div>
          )}
        </ButtonSky>
      </div>
    )
  }

  if (!kodeOpd) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Silakan pilih OPD terlebih dahulu untuk melihat data renaksi OPD.
      </div>
    )
  }

  if (!activatedTahun || !bulanKey) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Pilih dan aktifkan tahun dan bulan agar data renaksi OPD muncul.
      </div>
    )
  }

  return (
    <>
      {renderSyncButton()}
      <div className="overflow-auto grid gap-2">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Realisasi Renaksi OPD - {namaDinas ?? '-'}</h2>
        </div>

        {loading ? (
          <div className="rounded border border-emerald-200 px-4 py-6 text-center">
            <LoadingBeat loading={true} />
            <p className="text-sm text-gray-600 mt-2">Memuat data renaksi OPD...</p>
          </div>
        ) : error ? (
          <div className="rounded border border-red-300 px-4 py-6 text-center text-sm text-red-700">
            {String(error).toLowerCase().includes('404') ||
            String(error).toLowerCase().includes('not found') ||
            String(error).toLowerCase().includes('tidak ditemukan')
              ? 'Data OPD yang anda pilih tidak ada'
              : `Gagal memuat data renaksi: ${error}`}
          </div>
        ) : !rows.length ? (
          <div className="rounded border border-emerald-200 px-4 py-6 text-center text-sm text-gray-600">
            Data renaksi OPD belum di sinkronisasi atau dikunci.
          </div>
        ) : (
          <Table
            rows={rows}
            kodeOpd={kodeOpd}
            tahun={tahunValue ?? ''}
            bulanKey={bulanKey}
            bulanLabel={bulanName}
            onPrint={handleOpenPrintPreview}
            onFaktorSuccess={refetch}
          />
        )}

        {isPrintPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={handleClosePrintPreview}></div>
          <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 border-b pb-2">
              <h2 className="text-lg font-semibold uppercase">Preview Cetak Renaksi OPD</h2>
              <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
            </div>

            <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
              {pdfPreviewUrl ? (
                <iframe title="Preview PDF Renaksi OPD" src={pdfPreviewUrl} className="h-full w-full" />
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

      {isSyncModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setIsSyncModalOpen(false)}></div>
          <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Konfirmasi Sinkronisasi</h2>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Tidak
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSyncModalOpen(false)
                  handleSync()
                }}
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Ya
              </button>
            </div>
          </div>
        </div>
      )}

      {syncError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSyncError(null)}></div>
          <div className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Gagal Sinkronisasi</h2>
            <p className="text-gray-600 mb-6">{syncError}</p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setSyncError(null)}
                className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 w-full"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  )
}