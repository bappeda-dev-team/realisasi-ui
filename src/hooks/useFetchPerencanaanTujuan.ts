import { useEffect, useState } from 'react';
import { ApiPerencanaanResponse } from '@/types'

const url = `${process.env.NEXT_PUBLIC_API_URL}/perencanaan/tujuan_pemda/findall_with_pokin/2025/2030/rpjmd`

const useFetchPerencanaanTujuan = <T>(): ApiPerencanaanResponse<T> => {
    const [data, setData] = useState<T | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const responseData: T = await response.json();
                setData(responseData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useFetchPerencanaanTujuan;
