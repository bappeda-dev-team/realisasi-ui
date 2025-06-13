import { useState } from 'react'
import { SubmitResponse } from '@/types'

interface useSubmitDataProps {
  url: string;
  token: string | undefined;
}

export const useSubmitData = <T>({ url, token }: useSubmitDataProps): SubmitResponse<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  }

  const submit = async (payload: unknown): Promise<T | undefined> => {
    setLoading(true);
    try {
      const response = await fetch(url,
        {
          method: 'POST',
          headers: headers,
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
