'use client'

import React from 'react'
import Table from './Table'
import { useFilterContext } from '@/context/FilterContext'
import { getNamaBulan } from '@/lib/filter'

const TujuanPage = () => {
    const { activeFilter } = useFilterContext()
    const selectedTahun = activeFilter.tahun ?? '-'
    const selectedBulan = getNamaBulan(activeFilter.bulan)

    return (
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">
                Rencana Kinerja Individu - Tahun {selectedTahun} ({selectedBulan})
            </h2>
            <Table tahun={selectedTahun} />
        </div>
    )
}

export default TujuanPage
