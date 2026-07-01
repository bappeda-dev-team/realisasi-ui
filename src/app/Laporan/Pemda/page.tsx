'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Pemda() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/Laporan/Pemda/Tujuan')
  }, [])

  return null
}
