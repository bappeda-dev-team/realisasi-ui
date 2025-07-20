import { useState } from 'react'
import { SubmitResponse } from '@/types'
import { useApiUrlContext } from '@/context/ApiUrlContext';

interface useSubmitDataProps {
  url: string;
}

export const useSubmitData = <T>({ url }: useSubmitDataProps): SubmitResponse<T> => {
  const { token, csrf } = useApiUrlContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const headers: HeadersInit = {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(csrf && { 'X-XSRF-TOKEN': csrf })
  }

  const submit = async (payload: unknown): Promise<T | undefined> => {
    setLoading(true);
    try {
      const response = await fetch(url,
        {
          method: 'POST',
          headers: headers,
          credentials: 'include',
          body: JSON.stringify(payload),
        });

      if (!response.ok) {
        throw new Error('Failed to submit the request');
      }

      const responseData: T = await response.json();
      return responseData;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
