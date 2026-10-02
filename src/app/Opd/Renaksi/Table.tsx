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
  isLocked: boolean
  onPrint: () => void
  onFaktorSuccess: () => void
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
  isLocked,
  onPrint,
  onFaktorSuccess,
}) => {
  const [selectedRow, setSelectedRow] = useState<RenaksiRow | null>(null)
  const [isFaktorPenunjangModalOpen, setIsFaktorPenunjangModalOpen] = useState(false)
  const [isFaktorPenghambatModalOpen, setIsFaktorPenghambatModalOpen] = useState(false)

  const periodLabel = `${tahun || 'Tahun'} - ${bulanLabel || 'Bulan'}`

  const canEditFaktor = (row: RenaksiRow) =>
    !isLocked && row.realisasi !== null && Number(row.realisasi) !== 0

  const FaktorCell = ({ row, value, onEdit }: {
    row: RenaksiRow
    value: string
    onEdit: () => void
  }) => (
    <div className="flex flex-col items-center gap-2">
      <span className="whitespace-pre-line">{value || '-'}</span>
      <ButtonGreenBorder
        className="w-full text-xs py-0.5"
        disabled={!canEditFaktor(row)}
        onClick={onEdit}
      >
        Faktor
      </ButtonGreenBorder>
    </div>
  )

  const handleOpenFaktorPenunjang = (row: RenaksiRow) => {
    setSelectedRow(row)
    setIsFaktorPenunjangModalOpen(true)
  }

  const handleCloseFaktorPenunjang = () => {
    setIsFaktorPenunjangModalOpen(false)
    setSelectedRow(null)
  }

  const handleOpenFaktorPenghambat = (row: RenaksiRow) => {
    setSelectedRow(row)
    setIsFaktorPenghambatModalOpen(true)
  }

  const handleCloseFaktorPenghambat = () => {
    setIsFaktorPenghambatModalOpen(false)
    setSelectedRow(null)
  }

  return (
    <div className="overflow-auto m-2 rounded-t-xl">
      <table id="print-area-renaksi" className="w-full">
        <thead>
          <tr className="text-xm bg-emerald-500 text-white">
            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">
              No
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[180px]">
              Kode Renaksi
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">
              Rencana Aksi
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px]">
              Sasaran Kinerja
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">
              Subkegiatan
            </td>
            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[150px] text-center whitespace-nowrap">
              Anggaran (Rp)
            </td>
            <th colSpan={6} className="border-l border-b px-6 py-3 min-w-[100px] text-center uppercase">
              {periodLabel}
            </th>
            <td rowSpan={2} className="border-l border-b px-6 py-3 min-w-[120px] text-center">
              Aksi
            </td>
          </tr>
          <tr className="bg-emerald-500 text-white">
            <th className="border-l border-b px-3 py-2 min-w-[70px]">Target (%)</th>
            <th className="border-l border-b px-3 py-2 min-w-[90px]">Realisasi (%)</th>
            <th className="border-l border-b px-3 py-2 min-w-[80px]">Capaian (%)</th>
            <th className="border-l border-b px-3 py-2 min-w-[180px]">Keterangan Capaian</th>
            <th className="border-l border-b px-3 py-2 min-w-[150px]">Faktor Penunjang</th>
            <th className="border-l border-b px-3 py-2 min-w-[150px]">Faktor Penghambat</th>
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

      <FormModal
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
      </FormModal>

      <FormModal
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
      </FormModal>
    </div>
  )
}

export default Table