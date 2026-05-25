import { useEffect, useState, useCallback, useRef } from 'react';
import { FetchResponse } from '@/types'
import { getSessionId, notifySessionExpired } from "@/lib/session";

interface useFetchDataProps {
    url: string | null;
    trigger?: number;
}

export const useFetchData = <T>({ url, trigger }: useFetchDataProps): FetchResponse<T> & { refetch: () => void } => {
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

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: { 'X-Session-Id': sessionId },
                signal,
            });
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    notifySessionExpired();
                    throw new Error("Session habis, silakan login kembali.");
                }
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }
            const responseData: T = await response.json();
            if (!signal.aborted && requestIdRef.current === requestId) {
                setData(responseData);
            }
        } catch (err) {
            if (signal.aborted) {
                return;
            }

            if (requestIdRef.current === requestId) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        } finally {
            if (!signal.aborted && requestIdRef.current === requestId) {
                setLoading(false);
            }
        }
    }, [url]);

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
