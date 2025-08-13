import Select from 'react-select'

export default function () {
    const TahunOption = [
        { label: "Tahun 2019", value: 2019 },
        { label: "Tahun 2020", value: 2020 },
        { label: "Tahun 2021", value: 2021 },
        { label: "Tahun 2022", value: 2022 },
        { label: "Tahun 2023", value: 2023 },
        { label: "Tahun 2024", value: 2024 },
        { label: "Tahun 2025", value: 2025 },
        { label: "Tahun 2026", value: 2026 },
        { label: "Tahun 2027", value: 2027 },
        { label: "Tahun 2028", value: 2028 },
        { label: "Tahun 2029", value: 2029 },
        { label: "Tahun 2030", value: 2030 },
    ];

    return (
        <Select
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    borderTopRightRadius: '0px',
                    borderBottomRightRadius: '0px',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                    marginLeft: '4px',
                    // marginRight: '4px',
                    minWidth: '157.562px',
                    maxWidth: '160px',
                    minHeight: '38px'
                })
            }}
            options={TahunOption}
            placeholder="Tahun"
            isSearchable
        />
    );
}
