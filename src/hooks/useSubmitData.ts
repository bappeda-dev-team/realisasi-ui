import { useState } from "react";
import { SubmitResponse } from "@/types";

interface useSubmitDataProps {
  url: string;
}

export const useSubmitData = <T>({
  url,
}: useSubmitDataProps): SubmitResponse<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const submit = async (payload: unknown): Promise<T | undefined> => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errMsg = `Failed to submit the request (HTTP ${response.status})`;
        try {
          const errJson = await response.json();
          if (errJson?.message) errMsg = errJson.message;
        } catch (_) {}
        if (response.status === 401) {
          errMsg = "Silakan login.";
        }
        throw new Error(errMsg);
      }

      const responseData: T = await response.json();
      return responseData;
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "An unknown error occurred",
      );
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
