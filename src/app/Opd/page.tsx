'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Opd() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/Opd/Tujuan')
  }, [])

  return null
}
