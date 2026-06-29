'use client'

import React, { useState } from 'react';
import { ButtonSky } from '@/components/Global/Button/button';
import { LoadingButtonClip } from '@/components/Global/Loading';
import { getMonthKey } from '@/lib/months';
import { getSessionId, notifySessionExpired } from '@/lib/session';

interface FormFaktorPenghambatRenjaIndividuKegiatanProps {
  kodeOpd: string;
  kode: string;
  kodeIndikator: string;
  kodeTarget: string;
  tahun: string;
  bulan: string;
  currentValue: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ENDPOINT = '/api/v1/realisasi/renja_individu/kegiatan/faktor-penghambat';
const KODE_FIELD = 'kodeKegiatan';

const FormFaktorPenghambatRenjaIndividuKegiatan: React.FC<FormFaktorPenghambatRenjaIndividuKegiatanProps> = ({
  kodeOpd,
  kode,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedBulan) {
      alert('Bulan tidak valid.');
      return;
    }
    const sessionId = getSessionId();
    if (!sessionId) {
      alert('Silakan login terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Id': sessionId,
        },
        credentials: 'include',
        body: JSON.stringify({
          kodeOpd,
          [KODE_FIELD]: kode,
          kodeIndikator,
          kodeTarget,
          tahun,
          bulan: normalizedBulan,
          faktorPenghambat: value,
        }),
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
        Faktor Penghambat
      </label>
      <textarea
        className="w-full border rounded px-2 py-1 text-sm min-h-[100px]"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Masukkan faktor penghambat..."
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

export default FormFaktorPenghambatRenjaIndividuKegiatan;
