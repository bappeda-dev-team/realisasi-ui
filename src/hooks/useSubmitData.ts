import { useState } from "react";
import { SubmitResponse } from "@/types";
import Cookies from "js-cookie";

interface useSubmitDataProps {
  url: string;
}

export const useSubmitData = <T>({
  url,
}: useSubmitDataProps): SubmitResponse<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const submit = async (payload: unknown): Promise<T | undefined> => {
    const sessionId = Cookies.get("sessionId");

    if (!sessionId) {
      setError("Silakan login.");
      setLoading(false);
      return; // ⛔ STOP sampai sini, tidak lanjut fetch
    }

    setLoading(true);
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
        throw new Error("Failed to submit the request");
      }

      const responseData: T = await response.json();
      return responseData;
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
