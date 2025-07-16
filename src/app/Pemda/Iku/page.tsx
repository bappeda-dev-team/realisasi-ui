'use client'

import React from 'react'
import Table from './TableIku'

const SasaranPage = () => {
  return (
    <div className="transition-all ease-in-out duration-500">
      <h2 className="text-lg font-semibold mb-2">Halaman IKU</h2>
      {/* <p className="text-gray-700">
        Ini adalah konten untuk halaman <strong>Sasaran Pemda</strong>. Kamu bisa render tabel, grafik, atau form di sini.
      </p> */}
      <Table />
    </div>
  )
}

export default SasaranPage
