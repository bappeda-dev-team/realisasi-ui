import { useEffect, useState, useCallback, useRef } from 'react';
import { FetchResponse } from '@/types'
import { getSessionId, notifySessionExpired } from "@/lib/session";
import { isNetworkError, notifyNetworkError } from "@/lib/network-error";

interface useFetchDataProps {
    url: string | null;
    trigger?: number;
    retryCount?: number;
    retryDelay?: number;
}

export const useFetchData = <T>({ url, trigger, retryCount = 3, retryDelay = 1000 }: useFetchDataProps): FetchResponse<T> & { refetch: () => void } => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [triggerInternal, setTriggerInternal] = useState(0);
    const requestIdRef = useRef(0);

    const fetchData = useCallback(async (signal: AbortSignal, requestId: number) => {
        if (!url) {
            setData(undefined)
            setLoading(false)
            setError(undefined)
            return;
        }

        const sessionId = getSessionId()

        if (!sessionId) {
            setData(undefined)
            setError("Silakan login.");
            setLoading(false);
            return;
        }

        setLoading(true)
        setError(undefined)

        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= retryCount; attempt++) {
            if (signal.aborted) return;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'X-Session-Id': sessionId },
                    signal,
                });
                if (!response.ok) {
                    if (response.status === 401) {
                        notifySessionExpired();
                        throw new Error("Session habis, silakan login kembali.");
                    }
                    if (response.status === 403) {
                        throw new Error("Anda tidak memiliki akses (403).");
                    }
                    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
                }
                const responseData: T = await response.json();
                if (!signal.aborted && requestIdRef.current === requestId) {
                    setData(responseData);
                }
                lastError = undefined;
                break;
            } catch (err) {
                if (signal.aborted) return;
                lastError = err instanceof Error ? err : new Error('Terjadi error!');

                if (lastError.message.includes("Session habis")) {
                    throw lastError;
                }

                const networkErr = isNetworkError(lastError);
                if (networkErr && attempt < retryCount) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
                    continue;
                }

                if (networkErr) {
                    notifyNetworkError();
                    lastError = undefined;
                }
                break;
            }
        }

        if (!signal.aborted && requestIdRef.current === requestId) {
            if (lastError) {
                setError(lastError.message);
            }
            setLoading(false);
        }
    }, [url, retryCount, retryDelay]);

    useEffect(() => {
        const controller = new AbortController();
        requestIdRef.current += 1;
        const requestId = requestIdRef.current;

        fetchData(controller.signal, requestId);

        return () => {
            controller.abort();
        };
    }, [url, trigger, triggerInternal, fetchData]);

    const refetch = useCallback(() => {
        setTriggerInternal(prev => prev + 1);
    }, []);

    return { data, loading, error, refetch }
};
