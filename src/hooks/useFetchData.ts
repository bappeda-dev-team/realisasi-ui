import { useEffect, useState, useCallback } from 'react';
import { FetchResponse } from '@/types'
import { getSessionId } from "@/lib/session";

interface useFetchDataProps {
    url: string | null;
    trigger?: number;
}

export const useFetchData = <T>({ url, trigger }: useFetchDataProps): FetchResponse<T> & { refetch: () => void } => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [triggerInternal, setTriggerInternal] = useState(0);

    const fetchData = useCallback(async () => {
        if (!url) {
            setLoading(false)
            return;
        }
        let active = true;

        const sessionId = getSessionId()

        if (!sessionId) {
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
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [url, trigger, triggerInternal, fetchData]);

    const refetch = useCallback(() => {
        setTriggerInternal(prev => prev + 1);
    }, []);

    return { data, loading, error, refetch }
};
