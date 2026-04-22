'use client'

import React from 'react'
import { useFilterContext } from '@/context/FilterContext'
import Table from './Table'

const RenjaTargetPage = () => {
  const { activatedDinas: kodeOpd, activatedTahun: selectedTahun, activatedBulan: selectedBulan } = useFilterContext()

  if (!kodeOpd || !selectedTahun || !selectedBulan) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Harap pilih OPD, periode dan tahun, serta bulan dahulu
      </div>
    )
  }

  return (
    <div className="transition-all ease-in-out duration-500">
      <h2 className="text-lg font-semibold mb-2">Rencana Kerja OPD</h2>
      <Table />
    </div>
  )
}

export default RenjaTargetPage