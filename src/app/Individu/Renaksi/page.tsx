'use client'

import React from 'react'
import { useFilterContext } from '@/context/FilterContext'
import { useUserContext } from '@/context/UserContext'
import { ROLES } from '@/constants/roles'
import { getMonthName } from '@/lib/months'
import { getEffectiveUserLevel } from '@/lib/userLevelStyle'
import Table from './Table'

const SasaranPage = () => {
  const { user } = useUserContext()
  const { activatedDinas, activatedTahun, activatedBulan, activatedLevelRole, activatedNamaPegawai } = useFilterContext()
  const monthLabel = getMonthName(activatedBulan)
  const canBypassNip = user?.roles.includes(ROLES.SUPER_ADMIN) || user?.roles.includes(ROLES.ADMIN_OPD);
  const isLevel1 = getEffectiveUserLevel(user, activatedLevelRole) === ROLES.LEVEL_1
  const dataLabel = isLevel1 ? 'OPD' : 'Individu'
  const needsOpdSelection = (canBypassNip && !activatedDinas) || (isLevel1 && !(activatedDinas || user?.kode_opd))
  const needsPegawaiSelection = !isLevel1 && canBypassNip && (!activatedLevelRole || !activatedNamaPegawai)

  if (!user || (!isLevel1 && !user?.nip && !canBypassNip) || needsOpdSelection || !activatedTahun || !activatedBulan || needsPegawaiSelection) {
    return (
      <div className="p-5 bg-red-100 border-red-400 rounded text-red-700 my-5">
        {!user
          ? 'Silakan login terlebih dahulu untuk melihat data renaksi.'
          : needsOpdSelection
          ? `Pilih dan aktifkan OPD, tahun, dan bulan agar data renaksi ${dataLabel} muncul.`
          : !activatedTahun || !activatedBulan
            ? `Pilih dan aktifkan tahun dan bulan agar data renaksi ${dataLabel} muncul.`
            : 'Pilih dan aktifkan Level Role dan Nama Pegawai agar data renaksi individu muncul.'}
      </div>
    )
  }

  return (
    <div className="transition-all ease-in-out duration-500">
      <div className="flex items-center mb-2">
        <h2 className="text-lg font-semibold">Renaksi {dataLabel} - {activatedTahun} - {monthLabel}</h2>
      </div>
      <Table />
    </div>
  )
}

export default SasaranPage
