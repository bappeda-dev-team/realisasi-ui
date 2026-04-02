'use client'

import React from 'react'
import Table from './TableIku'
import { useFilterContext } from '@/context/FilterContext'
import { getNamaBulan } from '@/lib/filter'

const SasaranPage = () => {
  const { activeFilter } = useFilterContext()
  const selectedTahun = activeFilter.tahun ?? '-'
  const selectedBulan = getNamaBulan(activeFilter.bulan)

  return (
    <div className="transition-all ease-in-out duration-500">
      <h2 className="text-lg font-semibold mb-2">
        Halaman IKU - Tahun {selectedTahun} ({selectedBulan})
      </h2>
      {/* <p className="text-gray-700">
        Ini adalah konten untuk halaman <strong>Sasaran Pemda</strong>. Kamu bisa render tabel, grafik, atau form di sini.
      </p> */}
      <Table tahun={selectedTahun} />
    </div>
  )
}

export default SasaranPage
