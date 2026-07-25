import { useState } from "react";
import { SubmitResponse } from "@/types";
import { getSessionId, notifySessionExpired } from "@/lib/session";
import { isNetworkError, notifyNetworkError } from "@/lib/network-error";

interface useSubmitDataProps {
  url: string;
  retryCount?: number;
  retryDelay?: number;
}

export const useSubmitData = <T>({
  url,
  retryCount = 2,
  retryDelay = 1000,
}: useSubmitDataProps): SubmitResponse<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const submit = async (payload: unknown): Promise<T | undefined> => {
    const sessionId = getSessionId();

    if (!sessionId) {
      setError("Silakan login.");
      setLoading(false);
      return;
    }

    setLoading(true);
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-Id": sessionId,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            notifySessionExpired();
            throw new Error("Session habis, silakan login kembali.");
          }
          throw new Error("Failed to submit the request");
        }

        const responseData: T = await response.json();
        lastError = undefined;
        setLoading(false);
        return responseData;
      } catch (err) {
        lastError = err instanceof Error ? err : new Error("Terjadi error yang tidak diketahui");

        if (lastError.message.includes("Session habis")) {
          setError(lastError.message);
          setLoading(false);
          return undefined;
        }

        const networkErr = isNetworkError(lastError);
        if (networkErr && attempt < retryCount) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
          continue;
        }

        if (networkErr) {
          notifyNetworkError();
          lastError = undefined;
        }
        break;
      }
    }

    if (lastError) {
      setError(lastError.message);
    }
    setLoading(false);
    return undefined;
  };

  return { submit, loading, error };
};
