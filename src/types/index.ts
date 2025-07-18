export interface TargetRealisasiCapaianSasaran {
  targetRealisasiId: string;
  sasaranPemda: string;
  sasaranId: string;
  indikatorId: string;
  indikator: string;
  target: string;
  realisasi: number;
  capaian: string;
  satuan: string;
  tahun: string;
}

export type RealisasiSasaranResponse = RealisasiSasaran[]

export interface RealisasiSasaran {
  id: number;
  sasaranId: string;
  sasaran: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  status: "UNCHECKED" | "CHECKED";
  createdDate: string;
  lastModifiedDate: string;
  version: number;
  capaian: string;
}

export interface PerencanaanSasaranPemdaResponse {
  code: number;
  status: string;
  data: SasaranPemda[];
};

export interface Tematik {
  tematik_id: number;
  nama_tematik: string;
  subtematik: SubTematik[];
}

export interface SubTematik {
  subtematik_id: number;
  nama_subtematk: string;
  jenis_pohon: string;
  level_pohon: number;
  is_active: true;
  sasaran_pemda: SasaranPemda[];
}

export interface SasaranPemda {
  id: number;
  sasaran_pemda: string;
  tahun_awal: string;
  tahun_akhir: string;
  indikator: Indikator[];
}

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
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  status: "UNCHECKED" | "CHECKED";
  createdDate: string;
  lastModifiedDate: string;
  version: number;
  capaian: string;
}

export type RealisasiTujuanResponse = RealisasiTujuan[];

export interface TargetRealisasiCapaian {
  targetRealisasiId: string;
  tujuanPemda: string;
  tujuanId: string;
  indikatorId: string;
  indikator: string;
  target: string;
  realisasi: number;
  capaian: string;
  satuan: string;
  tahun: string;
}

export interface TujuanRequest {
  tujuanId: string;
  indikatorId: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  jenisRealisasi: string;
}

export interface Modal<T> {
  item: T | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface FormProps<T, L> {
  requestValues: T | null;
  onClose: () => void;
  onSuccess?: (updatedValue: L) => void;
}

export type FetchResponse<T> = {
  data?: T;
  loading: boolean;
  error?: string;
};

export type SubmitResponse<T> = {
  submit: (payload: any) => Promise<T | undefined>;
  loading: boolean;
  error?: string;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;
