'use client'

import React from 'react'
import { useFilterContext } from '@/context/FilterContext'
import { useUserContext } from '@/context/UserContext'
import { ROLES } from '@/constants/roles'
import Table from './Table'

const TujuanPage = () => {
    const { user } = useUserContext()
    const { activatedDinas, activatedTahun, activatedBulan } = useFilterContext()
    const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD)
    const needsOpdSelection = !activatedDinas

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
        <div className="transition-all ease-in-out duration-500">
            <h2 className="text-lg font-semibold mb-2">Rencana Kinerja Individu</h2>
            <Table />
        </div>
    )
}

export default TujuanPage
