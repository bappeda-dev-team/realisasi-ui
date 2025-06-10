import { useEffect, useState } from 'react';
import { FetchResponse } from '@/types'

const url = `${process.env.NEXT_PUBLIC_API_URL}/realisasi/tujuans/by-periode/2025/2030/rpjmd`
const token = process.env.NEXT_PUBLIC_API_ACCESS_TOKEN

const useFetchRealisasiTujuan = <T>(): FetchResponse<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) {
          throw new Error('Realisasi response was not ok');
        }
        const responseData: T = await response.json();
        setData(responseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error }
};

export default useFetchRealisasiTujuan
