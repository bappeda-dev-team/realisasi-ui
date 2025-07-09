import { useEffect, useState } from 'react';
import { FetchResponse } from '@/types'
import { useApiUrlContext } from '@/context/ApiUrlContext';

interface useFetchDataProps {
  url: string;
}

export const useFetchData = <T>({ url }: useFetchDataProps): FetchResponse<T> => {
  const { token } = useApiUrlContext();
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setLoading(true)
      setError(undefined)
      try {
        const response = await fetch(url, {
          headers: headers
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
        const responseData: T = await response.json();
        if (active) {
          setData(responseData);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [url]);

  return { data, loading, error }
};
