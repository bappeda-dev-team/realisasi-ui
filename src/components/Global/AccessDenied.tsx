"use client";

import Link from "next/link";
import { TbArrowBack } from "react-icons/tb";

interface AccessDeniedProps {
  message?: string;
}

export const AccessDenied = ({ message = "Anda tidak memiliki akses ke halaman ini." }: AccessDeniedProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
        <p className="text-gray-600 mb-6">{message}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#1C1D1D] text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition duration-300"
        >
          <TbArrowBack />
          Kembali ke Halaman Utama
        </Link>
      </div>
    </div>
  );
};