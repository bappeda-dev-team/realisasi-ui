'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Individu() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/Laporan/Individu/Rekin')
  }, [])

  return null
}
