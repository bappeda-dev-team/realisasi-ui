'use client'

import React, { useState, useEffect } from 'react'
import { useFilterContext } from '@/context/FilterContext'
import { useUserContext } from '@/context/UserContext'
import { ROLES } from '@/constants/roles'
import { getMonthKey } from '@/lib/months'
import { getSessionId } from '@/lib/session'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Select from 'react-select'
import Table from './Table'

const TujuanPage = () => {
    const { user } = useUserContext()
    const { activatedDinas, activatedTahun, activatedBulan, namaDinas } = useFilterContext()
    const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD)
    const needsOpdSelection = !activatedDinas

    const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false)
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
    const [pdfFileName, setPdfFileName] = useState('rekin-individu-laporan.pdf')
    const [previewDoc, setPreviewDoc] = useState<jsPDF | null>(null)
    const [selectedLaporanOption, setSelectedLaporanOption] = useState<{ label: string; value: string } | null>(null)

    const bulanKey = activatedBulan ? getMonthKey(activatedBulan) : null

    useEffect(() => {
        return () => {
            if (pdfPreviewUrl) {
                URL.revokeObjectURL(pdfPreviewUrl)
            }
        }
    }, [pdfPreviewUrl])

    const laporanOptions = [
        { label: 'Bulanan', value: 'BULANAN' },
        { label: 'Triwulan', value: 'TRIWULAN' },
        { label: 'Tahunan', value: 'TAHUNAN' },
    ]

    const handleGenerateLaporan = async (jenisLaporan: string) => {
        const baseUrl = `/api/v1/realisasi/rekin/laporan/nip/${user?.nip}/kodeOpd/${activatedDinas}/tahun/${activatedTahun}/jenisLaporan/${jenisLaporan}`
        const url = jenisLaporan === 'BULANAN' && bulanKey
            ? `${baseUrl}?bulan=${bulanKey}`
            : baseUrl

        const sessionId = getSessionId()
        if (!sessionId) return

        const res = await fetch(url, {
            headers: { 'X-Session-Id': sessionId },
        })
        if (!res.ok) return
        const data = await res.json()

        const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
        doc.setFontSize(14)
        doc.text(`Laporan Realisasi Rekin Individu - ${jenisLaporan} - ${namaDinas}`, 40, 40)
        doc.text(`Tahun: ${activatedTahun}`, 40, 58)

        const entries = Object.entries(data.list_data as Record<string, number>)
        const periodLabel = jenisLaporan === 'TRIWULAN' ? 'Triwulan' : 'Bulan'
        const tableBody = entries.map(([key, value]) => [
            `${periodLabel} ${key}`,
            String(value),
        ])

        autoTable(doc, {
            head: [['Periode', 'Realisasi (%)']],
            body: tableBody,
            startY: 72,
            styles: { fontSize: 10, cellPadding: 4 },
            headStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
            columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 80, halign: 'center' } },
            theme: 'grid',
        })

        const previewUrl = String(doc.output('bloburl'))
        if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl)
        }
        setPreviewDoc(doc)
        setPdfFileName(`laporan-realisasi-rekin-${jenisLaporan.toLowerCase()}-${activatedTahun}.pdf`)
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

    if ((!user?.nip && !canBypassNip) || needsOpdSelection || !activatedTahun || !activatedBulan) {
        return (
            <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
                {needsOpdSelection
                    ? 'Pilih dan aktifkan OPD, tahun, dan bulan agar data rekin individu muncul.'
                    : 'Pilih dan aktifkan tahun dan bulan agar data rekin individu muncul.'}
            </div>
        )
    }

    return (
        <div className="overflow-auto grid gap-2">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">Rencana Kinerja Individu</h2>
                <Select
                    value={selectedLaporanOption}
                    options={laporanOptions}
                    placeholder="Laporan Realisasi"
                    isSearchable={false}
                    onChange={(opt) => {
                        setSelectedLaporanOption(opt)
                        if (opt) handleGenerateLaporan(opt.value)
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
            <Table />
            {isPrintPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="fixed inset-0 bg-black/40" onClick={handleClosePrintPreview}></div>
                    <div className="relative z-10 w-[95vw] max-w-6xl rounded-lg bg-white p-4 shadow-lg">
                        <div className="mb-3 border-b pb-2">
                            <h2 className="text-lg font-semibold uppercase">Preview Laporan Realisasi Rekin Individu</h2>
                            <p className="text-sm text-gray-600">Periksa tampilan sebelum mengunduh PDF.</p>
                        </div>

                        <div className="h-[70vh] overflow-hidden rounded border border-gray-300">
                            {pdfPreviewUrl ? (
                                <iframe title="Preview PDF Laporan Rekin Individu" src={pdfPreviewUrl} className="h-full w-full" />
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
    )
}

export default TujuanPage
