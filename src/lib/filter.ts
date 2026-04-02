export function parsePeriodeRange(periode: string | null) {
  if (!periode) {
    return {
      tahunAwal: null as number | null,
      tahunAkhir: null as number | null,
      tahunList: [] as number[],
    };
  }

  const [awalStr, akhirStr] = periode.split("-").map((item) => item.trim());
  const tahunAwal = Number(awalStr);
  const tahunAkhir = Number(akhirStr);

  if (Number.isNaN(tahunAwal) || Number.isNaN(tahunAkhir)) {
    return {
      tahunAwal: null as number | null,
      tahunAkhir: null as number | null,
      tahunList: [] as number[],
    };
  }

  return {
    tahunAwal,
    tahunAkhir,
    tahunList: Array.from(
      { length: tahunAkhir - tahunAwal + 1 },
      (_, i) => tahunAwal + i,
    ),
  };
}

export function getNamaBulan(bulan: string | null) {
  const bulanMap: Record<string, string> = {
    "1": "Januari",
    "2": "Februari",
    "3": "Maret",
    "4": "April",
    "5": "Mei",
    "6": "Juni",
    "7": "Juli",
    "8": "Agustus",
    "9": "September",
    "10": "Oktober",
    "11": "November",
    "12": "Desember",
  };

  if (!bulan) return "-";
  return bulanMap[bulan] ?? `Bulan ${bulan}`;
}
