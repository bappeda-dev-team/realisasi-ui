'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'


export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const relativePath = pathname.replace(/^\/realisasi/, '')
  const navItems = [
    {
      label: 'Tujuan',
      href: '/Pemda/Tujuan',
      activeClass: 'bg-red-600 text-white border-red-600',
      inactiveClass: 'text-[#1C1D1D] hover:bg-red-700 hover:text-white',
    },
    {
      label: 'Sasaran',
      href: '/Pemda/Sasaran',
      activeClass: 'bg-green-600 text-white border-green-600',
      inactiveClass: 'text-[#1C1D1D] hover:bg-green-700 hover:text-white',
    },
    {
      label: 'IKU',
      href: '/Pemda/Iku',
      activeClass: 'bg-sky-600 text-white border-sky-600',
      inactiveClass: 'text-[#1C1D1D] hover:bg-sky-800 hover:text-white',
    },
  ]

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-wrap items-center justify-start gap-2">
        {navItems.map(({ label, href, activeClass, inactiveClass }) => {
          const isActive = relativePath === href || relativePath.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={`py-1 px-3 border border-[#1C1D1D] rounded-lg cursor-pointer transition-all duration-300 ${isActive ? activeClass : inactiveClass
                }`}
            >
              {label}
            </Link>
          )
        })}
      </div>
      <div className="mt-2 transition-all ease-in-out duration-500">
        {children}
      </div>
    </div>
  )
}
