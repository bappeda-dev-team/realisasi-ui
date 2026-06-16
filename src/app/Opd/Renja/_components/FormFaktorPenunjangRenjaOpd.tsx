'use client'

import React, { useState } from 'react';
import { ButtonSky } from '@/components/Global/Button/button';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { getMonthKey } from '@/lib/months';
import { getSessionId, notifySessionExpired } from '@/lib/session';

interface FormFaktorPenunjangRenjaOpdProps {
  kodeOpd: string;
  kodeRenja: string;
  jenisRenja: "Program" | "Kegiatan" | "Subkegiatan";
  kodeIndikator: string;
  kodeTarget: string;
  tahun: string;
  bulan: string;
  currentValue: string;
  onClose: () => void;
  onSuccess: () => void;
}

const FormFaktorPenunjangRenjaOpd: React.FC<FormFaktorPenunjangRenjaOpdProps> = ({
  kodeOpd,
  kodeRenja,
  jenisRenja,
  kodeIndikator,
  kodeTarget,
  tahun,
  bulan,
  currentValue,
  onClose,
  onSuccess,
}) => {
  const [value, setValue] = useState(currentValue);
  const [loading, setLoading] = useState(false);

  const normalizedBulan = getMonthKey(bulan);

  const getRenjaConfig = (currentJenisRenja: FormFaktorPenunjangRenjaOpdProps["jenisRenja"]) => {
    switch (currentJenisRenja) {
      case 'Program':
        return {
          endpoint: '/api/v1/realisasi/renja_opd/program/faktor-penunjang',
          kodeField: 'kodeProgram',
        } as const;
      case 'Kegiatan':
        return {
          endpoint: '/api/v1/realisasi/renja_opd/kegiatan/faktor-penunjang',
          kodeField: 'kodeKegiatan',
        } as const;
      case 'Subkegiatan':
        return {
          endpoint: '/api/v1/realisasi/renja_opd/subkegiatan/faktor-penunjang',
          kodeField: 'kodeSubkegiatan',
        } as const;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedBulan) {
      alert('Bulan tidak valid.');
      return;
    }
    const renjaConfig = getRenjaConfig(jenisRenja);
    if (!renjaConfig) {
      alert(`Jenis Renja tidak dikenali: ${jenisRenja}`);
      return;
    }
    const sessionId = getSessionId();
    if (!sessionId) {
      alert('Silakan login terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        kodeOpd,
        tahun,
        bulan: normalizedBulan,
        kodeIndikator,
        kodeTarget,
        faktorPenunjang: value,
        [renjaConfig.kodeField]: kodeRenja,
      };

      const res = await fetch(renjaConfig.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.status === 401 || res.status === 403) {
        notifySessionExpired();
        throw new Error('Session habis, silakan login kembali.');
      }
      if (!res.ok) throw new Error('Gagal menyimpan');
      onSuccess();
    } catch (err) {
      alert('Terjadi kesalahan saat menyimpan');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="uppercase text-xs font-bold text-gray-700">
        Faktor Penunjang
      </label>
      <textarea
        className="w-full border rounded px-2 py-1 text-sm min-h-[100px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Masukkan faktor penunjang..."
      />
      <ButtonSky className="w-full mt-3" type="submit" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingButtonClip />
            Menyimpan...
          </span>
        ) : (
          'Simpan'
        )}
      </ButtonSky>
    </form>
  );
};

export default FormFaktorPenunjangRenjaOpd;
