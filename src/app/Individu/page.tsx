'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Opd() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/Individu/Renaksi')
  }, [])

  return null
}
