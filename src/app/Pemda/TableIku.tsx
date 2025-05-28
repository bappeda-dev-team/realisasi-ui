const TableIku = () => {
    return(
        <div className="overflow-auto mt-2 rounded-t-lg border border-sky-600">
            <table className="w-full">
                <thead>
                    <tr className="text-white bg-sky-600">
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[50px] text-center">No</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Indikator Utama</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Rumus Perhitungan</th>
                        <th rowSpan={2} className="border-r border-b py-4 px-6 border-gray-300 min-w-[200px] text-center">Sumber Data</th>
                        <th colSpan={2} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2020</th>
                        <th colSpan={2} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2021</th>
                        <th colSpan={2} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2022</th>
                        <th colSpan={2} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2023</th>
                        <th colSpan={2} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2024</th>
                        <th colSpan={2} className="border-r border-b py-2 px-6 border-gray-300 min-w-[100px] text-center">2025</th>
                    </tr>
                    <tr className="text-white bg-sky-800">
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Target</th>
                        <th className="border-b border-r py-2 px-6 border-gray-300 min-w-[50px] text-center">Satuan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border-b border-sky-600 px-6 py-4 text-center">1</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">Indikator</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">Rumus Perhitungan</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">Sumber Data</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border border-sky-600 px-6 py-4 text-center">-</td>
                        <td className="border-b border-sky-600 px-6 py-4 text-center">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}
export default TableIku;