import { useEffect, useState } from 'react';
import { FetchResponse } from '@/types'

const url = `${process.env.NEXT_PUBLIC_API_URL}/realisasi/tujuans/by-periode/2025/2030/rpjmd`
const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJmUmhSRFU5TXpCT3lDaGc1YlVCT0F5dmVTREpFQTVMY0tCMDZlcl9VTW9vIn0.eyJleHAiOjE3NDk1MzM1NTksImlhdCI6MTc0OTUxNTU1OSwianRpIjoib25ydHJvOjI5ZTVhNmQ1LTVhYmQtNDhhOS05ZmY1LWYzYmUwMjlhMGI5MCIsImlzcyI6Imh0dHA6Ly9rZXljbG9hay5rZXJ0YXNrZXJqYS5sb2NhbC9yZWFsbXMvS2FiTWFkaXVuIiwic3ViIjoiYTg2YWE5MDctYTllMy00NDc1LWI0MDEtZDI2ODI2MmE0NTcyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZWRnZS1zZXJ2aWNlIiwic2lkIjoiZDMxNjA5ZmUtNmI1ZC00YWU4LWE5ZjctNDUwYzE0MzdmOTMzIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8va2VydGFza2VyamEubG9jYWwiXSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLWthYm1hZGl1biIsInN1cGVyX2FkbWluIiwib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiJdLCJuYW1lIjoiYWRtaW4gdGVzdCIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluX3Rlc3QiLCJnaXZlbl9uYW1lIjoiYWRtaW4iLCJmYW1pbHlfbmFtZSI6InRlc3QiLCJlbWFpbCI6ImFkbWluX3Rlc3RAdGVzdC5jb20ifQ.DL8fKZVpH7oeB31CVtXvNssVC9OYTQzXLxaFzth8y9ZJ40ud5LcTorAC-1GdQvlhQm3i5odS7poT6PvkvkxXHPE4Ki24gITDo5Q6eFCjSUiijiwAptXHGIQgBzhdRH4WPgDeFc6EbHSF-93InE6QuGJFpMYYIisdwnczBUAwAya3hIS-v6I0Wks8-iBy0IEhf-sV_BxvuNBLTD4PkoCLmhzaqew-j3eqnwhfUz6GD4hOLv1VjzKrk9tn-uAoErDuTML0Gbpat0yD2RrEgQdxuaBLnnKStqcfmLFf6m0-0K3R8_cz_0beaG9YCjZH8aZOUb3Na-enNxHUQ-1sf7RBFg"

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
          throw new Error('Network response was not ok');
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
