import { useState } from 'react'
import { TujuanRequest, RealisasiTujuan } from '@/types';

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/realisasi/tujuans/batch`
const token = process.env.NEXT_PUBLIC_API_ACCESS_TOKEN

const useSubmitRealisasiTujuan = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: TujuanRequest[]): Promise<RealisasiTujuan | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

      if (!response.ok) {
        throw new Error('Failed to submit the request');
      }

      const result: RealisasiTujuan = await response.json();
      return result;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
}

export default useSubmitRealisasiTujuan
