import { useEffect, useState } from 'react';
import { FetchResponse } from '@/types'

interface useFetchDataProps {
  url: string;
  token?: string | undefined;
}

export const useFetchData = <T>({ url, token }: useFetchDataProps): FetchResponse<T> => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(url, {
          headers: headers
        });
        if (!response.ok) {
          throw new Error('response was not ok');
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
