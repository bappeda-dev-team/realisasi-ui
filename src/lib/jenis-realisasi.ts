import { JenisRealisasi } from "@/types";

export const DEFAULT_JENIS_REALISASI: JenisRealisasi = "NAIK";

export const JENIS_REALISASI_OPTIONS: { label: string; value: JenisRealisasi }[] = [
  { label: "NAIK", value: "NAIK" },
  { label: "TURUN", value: "TURUN" },
];

// export const JENIS_REALISASI_HINT: Record<JenisRealisasi, string> = {
//   NAIK: "Semakin besar semakin baik",
//   TURUN: "Semakin kecil semakin baik",
// };

export const getJenisRealisasiOrDefault = (
  value: JenisRealisasi | null | undefined,
): JenisRealisasi => value ?? DEFAULT_JENIS_REALISASI;
