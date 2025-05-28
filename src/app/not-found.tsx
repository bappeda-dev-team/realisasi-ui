// app/not-found.js
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex flex-col gap-3'>
      <h1 className='font-bold text-4xl text-red-400 uppercase'>Halaman Tidak Ditemukan (404)</h1>
      <p>Halaman yang Anda cari tidak ada didalam website</p>
      <Link href="/">
        <button className='px-3 py-2 rounded-lg border border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer'>
            Kembali ke Beranda
        </button>
      </Link>
    </div>
  )
}