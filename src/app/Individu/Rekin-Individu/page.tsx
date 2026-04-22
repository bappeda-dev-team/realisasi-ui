'use client'

import React from 'react'
import { useFilterContext } from '@/context/FilterContext'
import { useUserContext } from '@/context/UserContext'
import Table from './Table'

const TujuanPage = () => {
    const { user } = useUserContext()
    const { activatedTahun, activatedBulan } = useFilterContext()

    if (!user?.nip || !activatedTahun || !activatedBulan) {
        return (
            <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
                Harap pilih tahun dan bulan dahulu
            </div>
        )
    }

    return (
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">Rencana Kinerja Individu</h2>
            <Table />
        </div>
    )
}

export default TujuanPage
