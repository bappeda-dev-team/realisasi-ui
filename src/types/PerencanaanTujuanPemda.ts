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
