'use client'

import React from 'react'
import { useFilterContext } from '@/context/FilterContext'
import { useUserContext } from '@/context/UserContext'
import { ROLES } from '@/constants/roles'
import Table from './Table'

const SasaranIndividuPage = () => {
  const { user } = useUserContext()
  const { activatedDinas, activatedTahun, activatedBulan } = useFilterContext()
  const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD)
  const needsOpdSelection = canBypassNip && !activatedDinas

  if (!activatedTahun || !activatedBulan) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Pilih dan aktifkan tahun dan bulan agar data sasaran individu muncul.
      </div>
    )
  }

  if (needsOpdSelection) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        Pilih dan aktifkan OPD, tahun, dan bulan agar data sasaran individu muncul.
      </div>
    )
  }

  return (
    <div className="transition-all ease-in-out duration-500">
      <h2 className="text-lg font-semibold mb-2">Sasaran Individu</h2>
      <Table />
    </div>
  )
}

export default SasaranIndividuPage
