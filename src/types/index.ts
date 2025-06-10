export interface Target {
  id: string;
  target: string;
  satuan: string;
  tahun: string;
};

export interface Indikator {
  id: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  target: Target[];
};

export interface Periode {
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
};

export interface TujuanPemda {
  id: number;
  id_misi: number;
  misi: string;
  tujuan_pemda: string;
  periode: Periode;
  indikator: Indikator[];
};

export interface PerencanaanTujuanPemda {
  pokin_id: number;
  nama_tematik: string;
  jenis_pohon: string;
  level_pohon: number;
  is_active: boolean;
  keterangan: string;
  tahun_pokin: string;
  tujuan_pemda: TujuanPemda[];
};

export interface PerencanaanTujuanPemdaResponse {
  code: number;
  status: string;
  data: PerencanaanTujuanPemda[];
};

export interface RealisasiTujuan {
  id: number;
  tujuanId: string;
  tujuan: string;
  indikatorId: string;
  indikator: string;
  target: number;
  realisasi: number;
  satuan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  status: "UNCHECKED" | "CHECKED";
  createdDate: string;
  lastModifiedDate: string;
  version: number;
}

export type RealisasiTujuanResponse = RealisasiTujuan[];

export type FetchResponse<T> = {
  data?: T;
  loading: boolean;
  error?: string;
};

export interface TargetRealisasiCapaian {
  targetRealisasiId: string;
  tujuanId: string;
  indikatorId: string;
  target: string;
  realisasi: string;
  capaian: string;
  satuan: string;
  tahun: string;
}
