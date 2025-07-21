import React from 'react'
import { IkuPemda } from '@/types'

interface RowIkuComponentProps {
    no: number;
    ikuPemda: IkuPemda;
    tahun: number;
}

export default function RowIkuComponent({
    no,
    ikuPemda,
    tahun
}: RowIkuComponentProps) {
    return (
        <>
            <tr key={ikuPemda.indikator_id}>
                <td className="border-x border-b border-sky-500 py-4 px-3 text-center">{no}</td>
                <td className="border-r border-b border-sky-500 px-6 py-4">{ikuPemda.indikator}</td>
                <td className="border-r border-b border-sky-500 px-6 py-4 text-center">{ikuPemda.asal_iku}</td>
                <td className="border-r border-b border-sky-500 px-6 py-4">{ikuPemda.rumus_perhitungan}</td>
                <td className="border-r border-b border-sky-500 px-6 py-4">{ikuPemda.sumber_data}</td>
            </tr>
        </>
    )
}
