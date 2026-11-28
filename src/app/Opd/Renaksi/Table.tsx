'use client'

import React, { useState } from 'react'
import { ButtonGreenBorder } from '@/components/Global/Button/button'
import { FormModal } from '@/components/Global/Modal'
import { formatPercentageText } from '@/lib/formatPercentageText'
import { RenaksiOpdPenetapanItem } from '@/types'
import FormFaktorPenunjangRenaksiOpd from './_components/FormFaktorPenunjangRenaksiOpd'
import FormFaktorPenghambatRenaksiOpd from './_components/FormFaktorPenghambatRenaksiOpd'

export interface RenaksiRow {
  kodeRencanaAksiOpd: string
  namaRenaksi: string
  kodeSasaranOpd: string
  kodeSubkegiatan: string
  namaSubkegiatan: string
  anggaran: number | null
  target: number | null
  realisasi: number | null
  capaian: number | null
  keteranganCapaian: string | null
  faktorPenunjang: string
  faktorPenghambat: string
}

interface TableProps {
  rows: RenaksiRow[]
  kodeOpd: string
  tahun: string
  bulanKey: string
  bulanLabel: string
  onPrint: () => void
  onFaktorSuccess: () => void
  canEditFaktor?: boolean
  headerColor?: string
}

export const mapPenetapanToRenaksiRows = (
  items: RenaksiOpdPenetapanItem[] | null | undefined,
): RenaksiRow[] =>
  (items ?? []).map((item) => {
    const realisasi = item.realisasi ?? null

    return {
      kodeRencanaAksiOpd: item.kode_rencana_aksi_opd ?? '',
      namaRenaksi: item.nama_renaksi?.trim() || '-',
      kodeSasaranOpd: item.kode_sasaran_opd?.trim() || '-',
      kodeSubkegiatan: item.kode_subkegiatan?.trim() || '-',
      namaSubkegiatan: item.nama_subkegiatan?.trim() || '-',
      anggaran: item.anggaran_renaksi ?? null,
      target: realisasi?.target ?? null,
      realisasi: realisasi?.realisasi ?? null,
      capaian: realisasi?.capaian ?? null,
      keteranganCapaian: realisasi?.keterangan_capaian ?? null,
      faktorPenunjang: realisasi?.faktor_penunjang ?? '',
      faktorPenghambat: realisasi?.faktor_penghambat ?? '',
    }
  })

export const formatRupiah = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-'

  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(value))
}

const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '-'
  return String(value)
}

const Table: React.FC<TableProps> = ({
  rows,
  kodeOpd,
  tahun,
  bulanKey,
  bulanLabel,
  onPrint,
  onFaktorSuccess,
  canEditFaktor = true,
  headerColor = 'bg-emerald-500 text-white',
}) => {
  const [selectedRow, setSelectedRow] = useState<RenaksiRow | null>(null)
  const [isFaktorPenunjangModalOpen, setIsFaktorPenunjangModalOpen] = useState(false)
  const [isFaktorPenghambatModalOpen, setIsFaktorPenghambatModalOpen] = useState(false)

  const periodLabel = `${tahun || 'Tahun'} - ${bulanLabel || 'Bulan'}`

  const hasRealisasi = (row: RenaksiRow) =>
    row.realisasi !== null && row.realisasi !== undefined && Number(row.realisasi) !== 0

  const FaktorCell = ({ row, value, onEdit }: {
    row: RenaksiRow
    value: string
    onEdit: () => void
  }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="whitespace-pre-line">{value || '-'}</span>
      {canEditFaktor && hasRealisasi(row) && (
        <ButtonGreenBorder
          className="w-full max-w-[120px] text-xs py-0.5"
          onClick={onEdit}
        >
          Faktor
        </ButtonGreenBorder>
      )}
    </div>
  )

  const handleOpenFaktorPenunjang = (row: RenaksiRow) => {
    if (!canEditFaktor) return
    setSelectedRow(row)
    setIsFaktorPenunjangModalOpen(true)
  }

  const handleCloseFaktorPenunjang = () => {
    setIsFaktorPenunjangModalOpen(false)
    setSelectedRow(null)
  }

  const handleOpenFaktorPenghambat = (row: RenaksiRow) => {
    if (!canEditFaktor) return
    setSelectedRow(row)
    setIsFaktorPenghambatModalOpen(true)
  }

  const handleCloseFaktorPenghambat = () => {
    setIsFaktorPenghambatModalOpen(false)
    setSelectedRow(null)
  }

  return (
    <>
      <table id="print-area-renaksi" className="w-full">
        <thead>
          <tr className={`text-xm ${headerColor}`}>
            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">
              <div className="flex flex-col items-center"><span>No</span><span>(1)</span></div>
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[180px]">
              <div className="flex flex-col items-center"><span>Kode Renaksi</span><span>(2)</span></div>
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">
              <div className="flex flex-col items-center"><span>Rencana Aksi</span><span>(3)</span></div>
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">
              <div className="flex flex-col items-center"><span>Sasaran Kinerja</span><span>(4)</span></div>
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">
              <div className="flex flex-col items-center"><span>Subkegiatan</span><span>(5)</span></div>
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px] text-center whitespace-nowrap">
              <div className="flex flex-col items-center"><span>Anggaran (Rp)</span><span>(6)</span></div>
            </td>
            <th colSpan={6} className="border-l border-b px-6 py-3 min-w-[100px] text-center uppercase">
              Realisasi - Renaksi
            </th>
            <td rowSpan={2} className="border-l border-b px-6 py-3 min-w-[120px] text-center">
              <div className="flex flex-col items-center"><span>Aksi</span><span>(13)</span></div>
            </td>
          </tr>
          <tr className={headerColor}>
            <th className="border-l border-b px-3 py-2 min-w-[70px]"><div className="flex flex-col items-center"><span>Target (%)</span><span>(7)</span></div></th>
            <th
              className="border-l border-b px-3 py-2 min-w-[90px]"
              title="Nilai otomatis dari realisasi Renaksi Individu"
            >
              <div className="flex flex-col items-center"><span>Realisasi (%)</span><span>(8)</span></div>
            </th>
            <th className="border-l border-b px-3 py-2 min-w-[80px]"><div className="flex flex-col items-center"><span>Capaian (%)</span><span>(9)</span><span>(8/7*100)</span></div></th>
            <th className="border-l border-b px-3 py-2 min-w-[180px]"><div className="flex flex-col items-center"><span>Keterangan Capaian</span><span>(10)</span></div></th>
            <th className="border-l border-b px-3 py-2 min-w-[250px]"><div className="flex flex-col items-center"><span>Faktor Penunjang</span><span>(11)</span></div></th>
            <th className="border-l border-b px-3 py-2 min-w-[250px]"><div className="flex flex-col items-center"><span>Faktor Penghambat</span><span>(12)</span></div></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.kodeRencanaAksiOpd || index}>
              <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                {index + 1}
              </td>
              <td className="border-r border-b border-emerald-500 px-6 py-4">
                {row.kodeRencanaAksiOpd || '-'}
              </td>
              <td className="border-r border-b border-emerald-500 px-6 py-4">{row.namaRenaksi}</td>
              <td className="border-r border-b border-emerald-500 px-6 py-4">{row.kodeSasaranOpd}</td>
              <td className="border-r border-b border-emerald-500 px-6 py-4">
                <div className="flex flex-col">
                  <span>{row.namaSubkegiatan}</span>
                  <span className="text-xs text-gray-500">({row.kodeSubkegiatan})</span>
                </div>
              </td>
              <td className="border-r border-b border-emerald-500 px-6 py-4 text-right whitespace-nowrap">
                {formatRupiah(row.anggaran)}
              </td>
              <td className="border-r border-b border-emerald-500 px-3 py-4 text-center align-middle">
                {formatNumber(row.target)}
              </td>
              <td className="border-r border-b border-emerald-500 px-3 py-4 text-center align-middle">
                {formatNumber(row.realisasi)}
              </td>
              <td className="border-r border-b border-emerald-500 px-3 py-4 text-center align-middle">
                {formatPercentageText(row.capaian ?? '-').replace(/%$/, '')}
              </td>
              <td className="border-r border-b border-emerald-500 px-3 py-4 text-center align-middle">
                {formatPercentageText(row.keteranganCapaian ?? '-')}
              </td>
              <td className="border-r border-b border-emerald-500 px-3 py-4 text-center align-middle">
                <FaktorCell
                  row={row}
                  value={row.faktorPenunjang}
                  onEdit={() => handleOpenFaktorPenunjang(row)}
                />
              </td>
              <td className="border-r border-b border-emerald-500 px-3 py-4 text-center align-middle">
                <FaktorCell
                  row={row}
                  value={row.faktorPenghambat}
                  onEdit={() => handleOpenFaktorPenghambat(row)}
                />
              </td>
              <td className="border-r border-b border-emerald-500 px-6 py-4">
                <div className="flex flex-col items-center gap-2">
                  {index === 0 ? (
                    <ButtonGreenBorder className="w-full" onClick={onPrint}>
                      Cetak
                    </ButtonGreenBorder>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {canEditFaktor && <FormModal
        isOpen={isFaktorPenunjangModalOpen}
        onClose={handleCloseFaktorPenunjang}
        title="Faktor Penunjang"
        maxWidthClass="max-w-lg"
      >
        <FormFaktorPenunjangRenaksiOpd
          kodeOpd={kodeOpd}
          tahun={tahun}
          bulan={bulanKey}
          kodeRencanaAksiOpd={selectedRow?.kodeRencanaAksiOpd ?? ''}
          namaRenaksi={selectedRow?.namaRenaksi ?? ''}
          currentValue={selectedRow?.faktorPenunjang ?? ''}
          onClose={handleCloseFaktorPenunjang}
          onSuccess={() => {
            handleCloseFaktorPenunjang()
            onFaktorSuccess()
          }}
        />
      </FormModal>}

      {canEditFaktor && <FormModal
        isOpen={isFaktorPenghambatModalOpen}
        onClose={handleCloseFaktorPenghambat}
        title="Faktor Penghambat"
        maxWidthClass="max-w-lg"
      >
        <FormFaktorPenghambatRenaksiOpd
          kodeOpd={kodeOpd}
          tahun={tahun}
          bulan={bulanKey}
          kodeRencanaAksiOpd={selectedRow?.kodeRencanaAksiOpd ?? ''}
          namaRenaksi={selectedRow?.namaRenaksi ?? ''}
          currentValue={selectedRow?.faktorPenghambat ?? ''}
          onClose={handleCloseFaktorPenghambat}
          onSuccess={() => {
            handleCloseFaktorPenghambat()
            onFaktorSuccess()
          }}
        />
      </FormModal>}
    </>
  )
}

export default Table
