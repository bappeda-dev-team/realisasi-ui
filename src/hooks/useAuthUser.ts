import { useState } from 'react'
import { SubmitResponse } from '@/types'
import Cookies from "js-cookie";

interface useAuthDataProps {
  url: string;
  storeCookies?: boolean;
}

// send login and store the keys
export const useAuthUser = <T extends Record<string, any>>({
  url,
  storeCookies = true
}: useAuthDataProps): SubmitResponse<T> => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(undefined);


  const submit = async (payload: unknown): Promise<T | undefined> => {
    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch(url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

      if (!response.ok) {
        let errMsg = `Request failed with status ${response.status}`;
        try {
          const errJson = await response.json();
          if (errJson.message) errMsg = errJson.message;
        } catch (_) {}
        throw new Error(errMsg);
      }

      const json = await response.json().catch(() => ({}));
      const result = json as T;


      if (storeCookies) {
        if (result.sessionId) {
          Cookies.set("sessionId", result.sessionId);
        }
      }

      setData(result);
      return result;

    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(msg);
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, data };
};
