import { useEffect, useState } from 'react';
import { FetchResponse } from '@/types'
import Cookies from "js-cookie";

interface useFetchDataProps {
    url: string | null;
}

export const useFetchData = <T>({ url }: useFetchDataProps): FetchResponse<T> => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);


    useEffect(() => {
        if (!url) {
            setLoading(false)
            return;
        }
        let active = true;

        const fetchData = async () => {
            const sessionId = Cookies.get("sessionId")

            if (!sessionId) {
                setError("Silakan login.");
                setLoading(false);
                return; // ⛔ STOP sampai sini, tidak lanjut fetch
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
        };

        fetchData();
        return () => {
            active = false;
        };
    }, [url]);

    return { data, loading, error }
};
