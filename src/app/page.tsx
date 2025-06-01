'use client'

import { useBrandingContext } from "@/context/BrandingContext";

export default function Home() {

  const { branding } = useBrandingContext();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 rounded-xl py-10 px-30 shadow-2xl shadow-gray-400">
        <h1 className="text-4xl uppercase font-extrabold">{branding.title}</h1>
        <h3 className="text-base font-light">{branding.client}</h3>
      </div>
    </div>
  )
}