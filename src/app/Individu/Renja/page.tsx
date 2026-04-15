'use client'

import React from 'react'
import Table from './Table'

const SasaranPage = () => {
  return (
    <div className="transition-all ease-in-out duration-500">
      <h2 className="text-lg font-semibold mb-2">Rencana Kerja</h2>
      {/* <p className="text-gray-700">
        Ini adalah konten untuk halaman <strong>Sasaran Pemda</strong>. Kamu bisa render tabel, grafik, atau form di sini.
      </p> */}
      <Table />
    </div>
  )
}

export default SasaranPage
