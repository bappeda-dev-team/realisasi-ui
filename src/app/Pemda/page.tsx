'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Pemda() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/Pemda/Tujuan')
  }, [])

  return null
}
