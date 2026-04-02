'use client';

import AsyncSelect from 'react-select/async';

interface OpdOptions {
    value: string;
    label: string;
}

const loadOpdOptions = async (inputValue: string): Promise<OpdOptions[]> => {
    if (!inputValue) {
        return [];
    }

    const allOpds: OpdOptions[] = [
        { value: 'test-kode', label: 'nama_opd_test' },
        { value: 'test-kode1', label: 'nama_opd_test_1' },
        { value: 'test-kode2', label: 'nama_opd_test_2' },
        { value: 'test-kode3', label: 'nama_opd_test_3' }
    ];

    return allOpds.filter(opd =>
        opd.label.toLowerCase().includes(inputValue.toLowerCase())
    );
}

export default function () {
    return (
        <div style={{ maxWidth: 800 }}>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOpdOptions}
                placeholder="Perangkat Daerah"
            />
        </div>
    );
}
