'use client'

import React, { useState, useEffect } from 'react'
import Select from "react-select"
import TableLaporanSasaranOpd from './table'

const laporanOptions = [
  { value: 'Bulanan', label: 'Bulanan' },
  { value: 'Triwulan', label: 'Triwulan' },
  { value: 'Tahunan', label: 'Tahunan' },
]

export default function LaporanSasaranOpd() {
  const [selectedLaporanOption, setSelectedLaporanOption] = useState<{ label: string; value: string } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('selectedLaporanOpdSasaran')
    if (saved) {
      try {
        setSelectedLaporanOption(JSON.parse(saved))
      } catch (e) {
        console.error(e)
      }
    }
    setIsLoaded(true)
  }, [])

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Laporan Realisasi Sasaran OPD</h2>
        <Select
          value={selectedLaporanOption}
          options={laporanOptions}
          placeholder="Laporan Realisasi"
          isSearchable={false}
          onChange={(opt) => {
            setSelectedLaporanOption(opt)
            if (opt) {
              localStorage.setItem('selectedLaporanOpdSasaran', JSON.stringify(opt))
            } else {
              localStorage.removeItem('selectedLaporanOpdSasaran')
            }
          }}
          formatOptionLabel={(option, { context }) =>
            context === 'value' ? `Laporan Realisasi : ${option.label}` : option.label
          }
          styles={{
            control: (base) => ({
              ...base,
              background: "linear-gradient(to right, #08C2FF, #006BFF)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              minHeight: 38,
              cursor: "pointer",
              boxShadow: "none",
            }),
            singleValue: (base) => ({ ...base, color: "#fff" }),
            placeholder: (base) => ({ ...base, color: "rgba(255,255,255,0.8)" }),
            dropdownIndicator: (base) => ({ ...base, color: "#fff" }),
            indicatorSeparator: () => ({ display: "none" }),
            menu: (base) => ({ ...base, zIndex: 20, minWidth: 180 }),
          }}
        />
      </div>
      {!isLoaded ? null : selectedLaporanOption ? (
        <TableLaporanSasaranOpd laporanType={selectedLaporanOption.value} />
      ) : (
        <div className="p-5 border border-dashed border-gray-300 rounded text-center text-gray-500 my-5">
          Pilih laporan realisasi agar data laporan sasaran opd muncul.
        </div>
      )}
    </div>
  )
}
