import { useEffect, useState } from 'react';
import { FetchResponse } from '@/types';

interface useFetchDataProps {
    url: string | null;
    requireSession?: boolean;
    withCredentials?: boolean;
}

export const useFetchData = <T>({
    url,
    requireSession = true,
    withCredentials = false,
}: useFetchDataProps): FetchResponse<T> => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (!url) {
            setLoading(false);
            return;
        }
        let active = true;

        const fetchData = async () => {
            setLoading(true);
            setError(undefined);

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: withCredentials ? 'include' : 'same-origin',
                });
                if (!response.ok) {
                    let errMsg = `HTTP ${response.status} - ${response.statusText}`;
                    try {
                        const errJson = await response.json();
                        if (errJson?.message) errMsg = errJson.message;
                    } catch (_) {}
                    if (requireSession && response.status === 401) {
                        errMsg = "Silakan login.";
                    }
                    throw new Error(errMsg);
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
    }, [url, requireSession, withCredentials]);

    return { data, loading, error };
};
