export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  nip?: string;
  kode_opd?: string;
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

export interface Indikator {
  id: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  target: Target[];
}

export interface Target {
  id: string;
  tahun: string;
  target: string;
  satuan: string;
}

export interface Periode {
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
}

export interface TujuanPemda {
  id: number;
  id_misi: number;
  misi: string;
  tujuan_pemda: string;
  periode: Periode;
  indikator: Indikator[];
}

export interface PerencanaanTujuanPemda {
  pokin_id: number;
  nama_tematik: string;
  jenis_pohon: string;
  level_pohon: number;
  is_active: boolean;
  keterangan: string;
  tahun_pokin: string;
  tujuan_pemda: TujuanPemda[];
}

export interface PerencanaanTujuanPemdaResponse {
  code: number;
  status: string;
  data: PerencanaanTujuanPemda[];
}

export interface RealisasiTujuan {
  id: number;
  tujuanId: string;
  tujuan: string;
  visiMisi?: string | null;
  indikatorId: string;
  indikator: string;
  rumusPerhitungan?: string | null;
  sumberData?: string | null;
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
  keteranganCapaian?: string | null;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
}

export type RealisasiTujuanResponse = RealisasiTujuan[];

export interface TargetRealisasiCapaian {
  targetRealisasiId: number | null;
  tujuanPemda: string;
  tujuanId: string;
  visiMisi: string;
  indikatorId: string;
  indikator: string;
  rumusPerhitungan: string;
  sumberData: string;
  targetId: string;
  target: string;
  realisasi: number;
  capaian: string;
  keteranganCapaian: string;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  satuan: string;
  tahun: string;
}

export interface TujuanPemdaRealisasiGroupedIndikator {
  id: string;
  indikator: string;
  rumusPerhitungan: string;
  sumberData: string;
  targets: TargetRealisasiCapaian[];
}

export interface TujuanPemdaRealisasiGrouped {
  tujuanId: string;
  tujuanPemda: string;
  visiMisi: string;
  indikator: TujuanPemdaRealisasiGroupedIndikator[];
}

export interface TujuanRequest {
  targetRealisasiId: number | null;
  tujuanId: string;
  visiMisi: string;
  indikatorId: string;
  rumusPerhitungan: string;
  sumberData: string;
  targetId: string;
  target: string;
  realisasi: number | '';
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
}

export interface SasaranRequest {
  targetRealisasiId: number | null;
  sasaranId: string;
  indikatorId: string;
  targetId: string;
  target: string;
  realisasi: number | '';
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
  rumusPerhitungan: string;
  sumberData: string;
}

export interface SasaranRequest {
  targetRealisasiId: number | null;
  sasaranId: string;
  indikatorId: string;
  targetId: string;
  target: string;
  realisasi: number | '';
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
  rumusPerhitungan: string;
  sumberData: string;
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
  data?: T;
};

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export type RealisasiSasaranResponse = RealisasiSasaran[];

export interface RealisasiSasaran {
  id: number;
  sasaranId: string;
  sasaran: string;
  indikatorId: string;
  indikator: string;
  rumusPerhitungan?: string | null;
  sumberData?: string | null;
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
  keteranganCapaian?: string | null;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
}

// tidak dipakai akan dihapus ketika renaksi opd jadi
export interface RenaksiIndividuResponse {
  id: number;
  renaksiId: string;
  renaksi: string;
  nama_pegawai?: string | null;
  nip: string;
  rekinId: string;
  rekin: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  bulan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  kodeOpd: string;
  status: "UNCHECKED" | "CHECKED";
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
  version: number;
  keteranganCapaian: string | null;
  capaian: string;
  anggaran?: string | null;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
}

export interface SasaranData {
  id: number;
  kodeOpd: string;
  nip: string;
  kodeSasaran: string;
  sasaran: string;
  tahun: string;
  bulan: string;
  status: "CHECKED" | "UNCHECKED";
  createdBy: string;
  lastModifiedBy: string;
  version: number;
}

export interface RenaksiHierarchyData {
  id: number;
  sasaranId: number;
  kodeOpd: string;
  nip: string;
  kodeRenaksi: string;
  renaksi: string;
  tahun: string;
  bulan: string;
  status: "CHECKED" | "UNCHECKED";
  createdBy: string;
  lastModifiedBy: string;
  version: number;
}

export interface IndikatorHierarchyData {
  id: number;
  renaksiId: number;
  kodeIndikator: string;
  indikator: string;
  kodeOpd: string;
  nip: string;
  tahun: string;
  bulan: string;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
}

export interface TargetHierarchyData {
  id: number;
  indikatorRenaksiId: number;
  kodeTarget: string;
  kodeOpd: string;
  nip: string;
  tahun: string;
  bulan: string;
  paguAnggaran: number;
  target: number;
  realisasi: number;
  jenisRealisasi: "NAIK" | "TURUN";
  faktorPenunjang: string;
  faktorPenghambat: string;
  createdBy: string;
  lastModifiedBy: string;
  keteranganCapaian: string;
  capaian: string;
  satuan: string;
}

export interface RenaksiIndividuHierarchyResponse {
  sasaran: SasaranData;
  renaksis: RenaksiHierarchyData[];
  indikators: IndikatorHierarchyData[];
  targets: TargetHierarchyData[];
}

export interface RenaksiTarget {
  targetRealisasiId: number | null;
  renaksiId: string;
  renaksi: string;
  nip: string;
  namaPegawai?: string;
  rekinId: string;
  rekin: string;
  targetId: string;
  target: string;
  realisasi: number | undefined;
  satuan: string;
  bulan?: string | null;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  capaian?: string;
  keteranganCapaian?: string | null;
  rencanaKinerja?: string;
  kodeOpd?: string;
  anggaran?: string | null;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  kodeSasaran?: string;
  kodeIndikator?: string;
  paguAnggaran?: number;
}

export interface RenaksiRealisasiRequest {
  id: number;
  kodeOpd: string;
  nip: string;
  kodeSasaran: string;
  kodeRenaksi: string;
  kodeIndikator: string;
  kodeTarget: string;
  target: number;
  realisasi: number;
  jenisRealisasi: "NAIK" | "TURUN";
  paguAnggaran: number;
  tahun: string;
  bulan: string;
}

export interface RenaksiTriwulanCell {
  target: number | string;
  realisasi: number;
  satuan: string;
  capaian: string;
  keteranganCapaian: string | null;
}

export interface RenaksiOpdTriwulanResponse {
  renaksiId: string;
  renaksi: string;
  rekinId: string;
  rekin: string;
  targetId: string;
  tw1: RenaksiTriwulanCell;
  tw2: RenaksiTriwulanCell;
  tw3: RenaksiTriwulanCell;
  tw4: RenaksiTriwulanCell;
}

export interface RenaksiOpdBatchMonthlyRequest {
  renaksiId: string;
  renaksi: string;
  kodeOpd: string;
  rekinId: string;
  rekin: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  bulan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
}

export interface RenaksiOpdMonthlyResponse {
  id: number;
  renaksiId: string;
  renaksi: string;
  rekinId: string;
  rekin: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  bulan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  kodeOpd: string;
  status?: string | null;
  createdBy?: string | null;
  lastModifiedBy?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  version?: number | null;
  capaian?: string | null;
  keteranganCapaian?: string | null;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
}

export interface RekinTarget {
  targetRealisasiId: number | null;
  rekinId: string;
  rekin: string;
  nip: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number | undefined;
  satuan: string;
  tahun: string;
  bulan?: string;
  jenisRealisasi: "NAIK" | "TURUN";
  capaian?: string | null;
  keteranganCapaian?: string | null;
  idSasaran?: string | null;
  sasaran?: string | null;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  kodeOpd?: string | null;
}

export interface RekinRealisasiRequest {
  kodeOpd: string;
  nip: string;
  kodePkRekin: string;
  kodeSasaranOpd: string;
  kodeIndikatorPKrekin: string;
  kodeTargetPKrekin: string;
  realisasi: number;
  tahun: string;
  bulan: string;
}

export interface RekinData {
  id: number;
  kodeOpd: string;
  nip: string;
  kodePkRekin: string;
  kodeSasaranOpd: string;
  rekin: string;
  tahun: string;
  bulan: string;
  status: string;
  nama_pegawai?: string | null;
  createdBy: string;
  lastModifiedBy: string;
}

export interface IndikatorData {
  id: number;
  rekinId: number;
  kodeIndikatorPkRekin: string;
  namaIndikatorPkRekin: string;
  kodeOpd: string;
  nip: string;
  tahun: string;
  bulan: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface TargetData {
  id: number;
  indikatorRekinId: number;
  kodeTargetPkRekin: string;
  kodeOpd: string;
  nip: string;
  tahun: string;
  bulan: string;
  target: number;
  realisasi: number;
  jenisRealisasi: string;
  faktorPenunjang: string;
  faktorPenghambat: string;
  createdBy: string;
  lastModifiedBy: string;
  keteranganCapaian: string | null;
  satuan: string;
  capaian: string;
}

export interface RekinIndividuResponse {
  id: number;
  kodeOpd: string;
  nip: string;
  tahun: string;
  bulan: string;
  kodePkRekin: string;
  kodeIndikatorPkRekin: string;
  kodeTargetPkRekin: string;
  realisasi: number;
  jenisRealisasi: string;
  faktorPenunjang: string;
  faktorPenghambat: string;
  createdBy: string;
  lastModifiedBy: string;
}

// ===== Rekin Individu - Penetapan (from penetapan endpoint) =====
export interface RekinPenetapanTarget {
  id: number;
  kode_target_pk: string;
  tahun: number;
  target: number;
  satuan: string;
  realisasi: number;
  capaian: number;
  keterangan_capaian: string;
  faktor_penunjang: string;
  faktor_penghambat: string;
  jenis_realisasi: string;
}

export interface RekinPenetapanIndikator {
  id: number;
  kode_indikator_pk: string;
  nama_indikator_pk: string;
  target_pk: RekinPenetapanTarget[];
}

export interface RekinPenetapanItem {
  id: number;
  kode_pk: string;
  rekin: string;
  versi: number;
  indikator_pk: RekinPenetapanIndikator[];
}

export interface RekinIndividuPenetapanResponse {
  pegawai_id: string;
  nama: string;
  kode_opd: string;
  tahun_aktif: number;
  bulan: number;
  rekins: RekinPenetapanItem[];
}

export interface PerencanaanSasaranPemdaResponse {
  code: number;
  status: string;
  data: TematikSasaranPemda[];
}

export interface TematikSasaranPemda {
  tematik_id: number;
  nama_tematik: string;
  subtematik: SubTematikSasaranPemda[];
}

export interface SubTematikSasaranPemda {
  subtematik_id: number;
  nama_subtematik: string;
  jenis_pohon: string;
  level_pohon: number;
  is_active: boolean;
  sasaran_pemda: SasaranPemda[];
}

export interface SasaranPemda {
  id_sasaran_pemda: number;
  sasaran_pemda: string;
  periode: Periode;
  indikator: Indikator[];
}

export interface IkuPemdaTargetRealisasiCapaian {
  targetRealisasiId: string | null;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  capaian: string;
  satuan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN" | null;
  jenisIku: "TUJUAN" | "SASARAN" | null;
}

export interface IkuPemdaRealisasi {
  id: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  tahun: string;
  realisasi: number;
  satuan: string;
  capaian: string;
  jenisRealisasi: "NAIK" | "TURUN" | null;
  jenisIku: "TUJUAN" | "SASARAN" | null;
}

export type IkuPemdaRealisasiResponse = IkuPemdaRealisasi[];

export interface IkuPemda {
  indikator_id: string;
  asal_iku: string;
  indikator: string;
  is_active: boolean;
  rumus_perhitungan: string;
  sumber_data: string;
  target: Target[];
}

export interface IkuPemdaPerencanaanResponse {
  code: number;
  status: string;
  data: IkuPemda[];
}

export interface TargetRealisasiCapaianSasaran {
  targetRealisasiId: number | null;
  sasaranPemda: string;
  sasaranId: string;
  indikatorId: string;
  indikator: string;
  rumusPerhitungan: string;
  sumberData: string;
  targetId: string;
  target: string;
  realisasi: number;
  capaian: string;
  keteranganCapaian: string;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  satuan: string;
  tahun: string;
}

export interface SasaranPemdaRealisasiGroupedIndikator {
  id: string;
  indikator: string;
  rumusPerhitungan: string;
  sumberData: string;
  targets: TargetRealisasiCapaianSasaran[];
}

export interface SasaranPemdaRealisasiGrouped {
  sasaranId: string;
  sasaranPemda: string;
  indikator: SasaranPemdaRealisasiGroupedIndikator[];
}

export interface TujuanOpdPerencanaan {
  id_tujuan_opd: string;
  tujuan: string;
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
  indikator: IndikatorTujuanOpd[];
}

export interface IndikatorTujuanOpd {
  id: string;
  id_tujuan_opd: number;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  target: TargetIndikatorTujuanOpd[];
}

export interface TargetIndikatorTujuanOpd {
  id: string;
  indikator_id: string;
  tahun: string;
  target: string;
  satuan: string;
}

export interface InfoOpd {
  kode_urusan: string;
  urusan: string;
  kode_bidang_urusan: string;
  nama_bidang_urusan: string;
  kode_opd: string;
  nama_opd: string;
  tujuan_opd: TujuanOpdPerencanaan[];
}

export interface TujuanOpdPerencanaanResponse {
  code: number;
  status: string;
  data: InfoOpd[];
}

export interface TujuanOpdTargetRealisasiCapaian {
  targetRealisasiId: number | null;
  tujuanOpd: string;
  tujuanId: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number | null;
  capaian: string;
  keteranganCapaian: string;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  satuan: string;
  tahun: string;
  kodeOpd: string;
  rumusPerhitungan: string;
  sumberData: string;
}

export interface TujuanOpdRealisasi {
  id: number;
  tujuanId: string;
  tujuan: string;
  indikatorId: string;
  indikator: string;
  bulan: string;
  rumusPerhitungan?: string | null;
  sumberData?: string | null;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  kodeOpd: string;
  status: "UNCHECKED" | "CHECKED";
  createdDate: string;
  lastModifiedDate: string;
  version: number;
  capaian: string;
  keteranganCapaian?: string | null;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
}


export interface TujuanOpdRealisasiGroupedIndikator {
  id: string;
  indikator: string;
  rumusPerhitungan: string;
  sumberData: string;
  targets: TujuanOpdTargetRealisasiCapaian[];
}

export interface TujuanOpdRealisasiGrouped {
  tujuanId: string;
  tujuanOpd: string;
  indikator: TujuanOpdRealisasiGroupedIndikator[];
}

export interface TujuanOpdRealisasiRequest {
  targetRealisasiId: number | null;
  tujuanId: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number | null;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
  kodeOpd: string;
  rumusPerhitungan: string;
  sumberData: string;
}

// ===== Tujuan OPD - Penetapan (from penetapan-service) =====
export interface TujuanOpdPenetapanTarget {
  kode_target: string;
  target: number;
  satuan: string;
  realisasi: number | null;
  capaian: number | null;
  keterangan_capaian: string | null;
  faktor_penunjang?: string | null;
  faktor_penghambat?: string | null;
}

export interface TujuanOpdPenetapanIndikator {
  id: number;
  kode_indikator: string;
  indikator: string;
  rumus_perhitungan?: string | null;
  sumber_data?: string | null;
  definisi_operasional?: string | null;
  targets: TujuanOpdPenetapanTarget[];
}

export interface TujuanOpdPenetapanTujuan {
  id: number;
  kode_tujuan_opd: string;
  tujuan_opd: string;
  indikators: TujuanOpdPenetapanIndikator[];
}

export interface TujuanOpdPenetapanResponse {
  kode_opd: string;
  tahun: number;
  bulan: number | null;
  tujuanOpds: TujuanOpdPenetapanTujuan[];
}

// ===== Tujuan OPD - Realisasi (nested response from realisasi service) =====
export interface TujuanOpdRealisasiTarget {
  id: number;
  kode_target: string;
  target: number;
  satuan: string;
  tahun: number;
  bulan: number;
  realisasi: number;
  capaian: number;
  keterangan_capaian: string;
  faktor_penunjang?: string | null;
  faktor_penghambat?: string | null;
}

export interface TujuanOpdRealisasiIndikator {
  id: number;
  kode_indikator: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  definisi_operasional: string;
  tahun: number;
  bulan: number;
  targets: TujuanOpdRealisasiTarget[];
}

export interface TujuanOpdRealisasiItem {
  id: number;
  kode_opd: string;
  kode_tujuan_opd: string;
  tujuan_opd: string;
  tahun: number;
  bulan: number;
  indikators: TujuanOpdRealisasiIndikator[];
}

export interface TujuanOpdRealisasiResponse {
  id: number;
  kode_opd: string;
  tahun: number;
  bulan: number;
  kode_tujuan_opd: string;
  kode_indikator: string;
  kode_target: string;
  realisasi: number;
  faktor_penunjang: string;
  faktor_penghambat: string;
  tujuan_opd: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  definisi_operasional: string;
  target: number;
  satuan: string;
  capaian: number;
  keterangan_capaian: string;
  jenis_realisasi: string;
  created_by: string;
  last_modified_by: string;
}

export interface TujuanOpdRealisasiPayload {
  kodeTujuanOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  realisasi: number;
  jenisRealisasi: string;
  tahun: string;
  bulan: string;
  kodeOpd: string;
}

export interface TujuanOpdFaktorPenunjangPayload {
  kodeOpd: string;
  kodeTujuanOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  tahun: string;
  bulan: string;
  faktorPenunjang: string;
}

export interface TujuanOpdFaktorPenunjangResponse {
  id: number;
  kodeOpd: string;
  tahun: string;
  bulan: string;
  kodeTujuanOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  realisasi: number;
  jenisRealisasi: string;
  faktorPenunjang: string;
  faktorPenghambat: string;
  createdBy: string;
  lastModifiedBy: string;
}

// ===== Tujuan OPD - POST Faktor Penghambat =====
export interface TujuanOpdFaktorPenghambatPayload {
  kodeOpd: string;
  kodeTujuanOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  tahun: string;
  bulan: string;
  faktorPenghambat: string;
}

export interface TujuanOpdFaktorPenghambatResponse {
  id: number;
  kodeOpd: string;
  tahun: string;
  bulan: string;
  kodeTujuanOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  realisasi: number;
  jenisRealisasi: string;
  faktorPenunjang: string;
  faktorPenghambat: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface SasaranOpdPerencanaanResponse {
  code: number;
  status: string;
  data: PohonSasaranOpd[];
}

interface PohonSasaranOpd {
  id_pohon: number;
  nama_pohon: string;
  jenis_pohon: string;
  tahun_pohon: string;
  level_pohon: number;
  sasaran_opd: SasaranOpdPerencanaan[];
}

export interface SasaranOpdPerencanaan {
  id: number;
  nama_sasaran_opd: string;
  id_tujuan_opd: number;
  nama_tujuan_opd: string;
  tahun_awal: string;
  tahun_akhir: string;
  jenis_periode: string;
  indikator: Indikator[];
}

export interface SasaranOpdPenetapanTarget {
  kode_target: string;
  satuan: string;
  target: number;
  realisasi: number;
  capaian: number;
  keterangan_capaian: string;
  faktor_penunjang?: string | null;
  faktor_penghambat?: string | null;
}

export interface SasaranOpdPenetapanIndikator {
  kode_indikator: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  definisi_operasional: string;
  targets: SasaranOpdPenetapanTarget[];
}

export interface SasaranOpdPenetapanSasaran {
  id: number;
  kode_sasaran_opd: string;
  sasaran_opd: string;
  faktor_penunjang?: string | null;
  faktor_penghambat?: string | null;
  indikators: SasaranOpdPenetapanIndikator[];
}

export interface SasaranOpdPenetapanResponse {
  kode_opd: string;
  tahun: number;
  bulan: number;
  sasaranOpds: SasaranOpdPenetapanSasaran[];
}

export interface SasaranOpdRealisasiPayload {
  kodeSasaranOpd: string;
  kodeIndikatorSasaranOpd: string;
  kodeTargetSasaranOpd: string;
  realisasi: number;
  tahun: number;
  bulan: number;
  kodeOpd: string;
}

export interface SasaranOpdRealisasiPenetapanTarget {
  id: number;
  kode_target: string;
  target: number;
  satuan: string;
  tahun: number;
  bulan: number;
  realisasi: number;
  capaian: number;
  keterangan_capaian: string;
}

export interface SasaranOpdRealisasiPenetapanIndikator {
  id: number;
  kode_indikator: string;
  indikator: string;
  rumus_perhitungan: string;
  sumber_data: string;
  definisi_operasional: string;
  tahun: number;
  bulan: number;
  targets: SasaranOpdRealisasiPenetapanTarget[];
}

export interface SasaranOpdRealisasiPenetapanItem {
  id: number;
  kode_opd: string;
  kode_sasaran_opd: string;
  sasaran_opd: string;
  tahun: number;
  bulan: number;
  indikators: SasaranOpdRealisasiPenetapanIndikator[];
}

export interface SasaranOpdRealisasiPenetapanResponse {
  kode_opd: string;
  tahun: number;
  sasaran_opds: SasaranOpdRealisasiPenetapanItem[];
}

export interface SasaranOpdRealisasi {
  id: number;
  renjaId: string;
  renja: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: "NAIK" | "TURUN";
  kodeOpd: string;
  rumusPerhitungan?: string | null;
  sumberData?: string | null;
  status: "UNCHECKED" | "CHECKED";
  createdDate: string;
  lastModifiedDate: string;
  version: number;
  capaian: string;
  keteranganCapaian?: string | null;
}

export type SasaranOpdRealisasiResponse = SasaranOpdRealisasi[];

export interface SasaranOpdTargetRealisasiCapaian {
  targetRealisasiId: number | null;
  renja: string;
  renjaId: string;
  sasaranOpd?: string;
  sasaranId?: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  capaian: string;
  keteranganCapaian: string;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
  satuan: string;
  tahun: string;
  kodeOpd: string;
  rumusPerhitungan: string;
  sumberData: string;
}

export interface SasaranOpdRealisasiGroupedIndikator {
  id: string;
  indikator: string;
  rumusPerhitungan: string;
  sumberData: string;
  targets: SasaranOpdTargetRealisasiCapaian[];
}

export interface SasaranOpdRealisasiGrouped {
  renjaId: string;
  renja: string;
  indikator: SasaranOpdRealisasiGroupedIndikator[];
}

export interface SasaranOpdPenetapanGrouped {
  sasaranId: string;
  sasaranOpd: string;
  indikator: SasaranOpdRealisasiGroupedIndikator[];
}

export interface SasaranOpdRealisasiRequest {
  targetRealisasiId: number | null;
  renjaId: string;
  indikatorId: string;
  targetId: string;
  target: string;
  realisasi: number | null;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
  kodeOpd: string;
  rumusPerhitungan: string;
  sumberData: string;
}

// ===== Sasaran OPD - POST Faktor Penunjang =====
export interface SasaranOpdFaktorPenunjangPayload {
  kodeOpd: string;
  kodeSasaranOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  tahun: string;
  bulan: string;
  faktorPenunjang: string;
}

export interface SasaranOpdFaktorPenunjangResponse {
  id: number;
  kodeOpd: string;
  tahun: string;
  bulan: string;
  kodeSasaranOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  realisasi: number;
  jenisRealisasi: string;
  faktorPenunjang: string;
  faktorPenghambat: string;
  createdBy: string;
  lastModifiedBy: string;
}

// ===== Sasaran OPD - POST Faktor Penghambat =====
export interface SasaranOpdFaktorPenghambatPayload {
  kodeOpd: string;
  kodeSasaranOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  tahun: string;
  bulan: string;
  faktorPenghambat: string;
}

export interface SasaranOpdFaktorPenghambatResponse {
  id: number;
  kodeOpd: string;
  tahun: string;
  bulan: string;
  kodeSasaranOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  realisasi: number;
  jenisRealisasi: string;
  faktorPenunjang: string;
  faktorPenghambat: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface SasaranIndividuTargetRealisasiCapaian {
  targetRealisasiId: number | null;
  renjaId: string;
  renja: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  capaian: string;
  keteranganCapaian: string;
  satuan: string;
  tahun: string;
  nip: string;
  rumusPerhitungan: string;
  sumberData: string;
  jenisRealisasi: "NAIK" | "TURUN";
  bulan: string;
  kodeTarget: string;
}

export interface SasaranIndividuRealisasiGroupedIndikator {
  id: string;
  indikator: string;
  rumusPerhitungan: string;
  sumberData: string;
  targets: SasaranIndividuTargetRealisasiCapaian[];
  kodeIndikator: string;
}

export interface SasaranIndividuRealisasiGrouped {
  renjaId: string;
  renja: string;
  nama_pegawai: string;
  nip: string;
  indikator: SasaranIndividuRealisasiGroupedIndikator[];
  kodeSasaranOpd: string;
  kodeOpd: string;
}

export interface SasaranIndividuRealisasiRequest {
  targetRealisasiId: number | null;
  renjaId: string;
  indikatorId: string;
  targetId: string;
  target: string;
  realisasi: number | null;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
  nip: string;
  rumusPerhitungan: string;
  sumberData: string;
}

export interface SasaranIndividuPenetapanResponse {
  kode_opd: string;
  tahun: number;
  bulan: number;
  sasaranIndividus: SasaranOpdPenetapanSasaran[];
}

export interface SasaranIndividuPenetapanPayload {
  kodeSasaranOpd: string;
  kodeIndikator: string;
  kodeTarget: string;
  realisasi: number | null;
  tahun: string;
  bulan: string;
  kodeOpd: string;
  nip: string;
  namaPegawai: string;
}

export interface SasaranTargetRealisasiInfo {
  kodeSasaranOpd: string;
  sasaranOpd: string;
  kodeIndikator: string;
  indikator: string;
  kodeTarget: string;
  target: string;
  realisasi: number | null;
  satuan: string;
  kodeOpd: string;
  nip: string;
  namaPegawai: string;
}

export interface RenjaTargetIndividuResponse {
  id: number;
  renjaId: string;
  renja: string;
  kodeRenja: string;
  jenisRenja: "PROGRAM" | "KEGIATAN" | "SUB_KEGIATAN";
  nama_pegawai?: string | null;
  nip: string;
  idIndikator: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: "NAIK" | "TURUN";
  status: "CHECKED" | "UNCHECKED";
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
  capaian: string;
  keteranganCapaian: string;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
}

export type RenjaTargetIndividuResponseList = RenjaTargetIndividuResponse[];

export interface RenjaTarget {
  targetRealisasiId: number | null;
  renjaId: string;
  renja: string;
  kodeRenja: string;
  jenisRenja: string;
  nip: string;
  idIndikator: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan?: string;
  jenisRealisasi: "NAIK" | "TURUN";
  capaian?: string;
  keteranganCapaian?: string;
  pagu?: number | null;
  realisasiPagu?: number | null;
  satuanPagu?: string;
  capaianPagu?: string;
  keteranganCapaianPagu?: string;
  faktorPenunjang?: string | null;
  faktorPenghambat?: string | null;
}

export interface RenjaBatchRequest {
  targetRealisasiId: number | null;
  kodeRenja: string;
  jenisRenja: string;
  nip: string;
  idIndikator: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan?: string;
  jenisRealisasi: string;
}

export interface RenjaPaguIndividuResponse {
  id: number;
  renjaId: string;
  renja: string;
  kodeRenja: string;
  jenisRenja: "PROGRAM" | "KEGIATAN" | "SUB_KEGIATAN";
  nama_pegawai?: string | null;
  nip: string;
  idIndikator: string;
  indikator: string;
  pagu: number;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: "NAIK" | "TURUN";
  status: "CHECKED" | "UNCHECKED";
  createdBy: string;
  lastModifiedBy: string;
  createdDate: string;
  lastModifiedDate: string;
  version: number;
  capaian: string;
  keteranganCapaian: string;
}

export type RenjaPaguIndividuResponseList = RenjaPaguIndividuResponse[];

export interface RenjaPaguTarget {
  targetRealisasiId: number | null;
  renjaId: string;
  renja: string;
  kodeRenja: string;
  jenisRenja: string;
  nip: string;
  idIndikator: string;
  indikator: string;
  pagu: number;
  targetId: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  jenisRealisasi: "NAIK" | "TURUN";
  capaian?: string;
  keteranganCapaian?: string;
}

export interface RenjaPaguBatchRequest {
  targetRealisasiId: number | null;
  kodeRenja: string;
  jenisRenja: string;
  nip: string;
  idIndikator: string;
  indikator: string;
  pagu: number;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan?: string;
  jenisRealisasi: string;
}

export interface SasaranIndividuResponse {
  id: number;
  renjaId: string;
  renja: string;
  nama_pegawai?: string | null;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: "NAIK" | "TURUN";
  nip: string;
  rumusPerhitungan: string;
  sumberData: string;
  status: "CHECKED" | "UNCHECKED";
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  version: number;
  keteranganCapaian: string;
  capaian: string;
}

export type SasaranIndividuResponseList = SasaranIndividuResponse[];

export interface RenjaTargetOpdResponse {
  id: number | null;
  jenisRenjaId: string;
  jenisRenjaTarget: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number | null;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: "NAIK" | "TURUN";
  kodeOpd: string;
  kodeRenja: string;
  status: string;
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  version: number;
  capaian: string;
  keteranganCapaian: string;
}

export interface RenjaTargetOpdRequest {
  targetRealisasiId: number | null;
  jenisRenjaId: string;
  jenisRenja: string;
  indikatorId: string;
  indikator: string;
  targetId: string;
  target: string;
  realisasi: number | null;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
  kodeOpd: string;
  kodeRenja: string;
}

export interface RenjaPaguOpdResponse {
  id: number | null;
  jenisRenjaId: string;
  jenisRenjaPagu: "PROGRAM" | "KEGIATAN" | "SUB_KEGIATAN";
  pagu: number;
  realisasi: number | null;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: "NAIK" | "TURUN";
  kodeOpd: string;
  kodeRenja: string;
  status: "CHECKED" | "UNCHECKED";
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  version: number;
  capaian: string;
  keteranganCapaian: string;
}

export interface RenjaPaguOpdBatchRequest {
  targetRealisasiId: number | null;
  jenisRenjaId: string;
  jenisRenja: string;
  pagu: number;
  realisasi: number;
  satuan: string;
  tahun: string;
  bulan: string;
  jenisRealisasi: string;
  kodeOpd: string;
  kodeRenja: string;
}

// ===== Renja OPD - Penetapan (from renja-service on port 9001) =====
export interface RenjaPenetapanTarget {
  id: number;
  kode_target: string;
  tahun: number;
  bulan: number | null;
  target: number;
  realisasi: number | null;
  satuan: string;
  capaian: number | null;
  keterangan_capaian: string | null;
  faktor_penunjang?: string | null;
  faktor_penghambat?: string | null;
}

export interface RenjaPenetapanIndikator {
  id: number;
  kode_indikator: string;
  indikator: string;
  targets: RenjaPenetapanTarget[];
}

export interface RenjaPenetapanProgram {
  id: number;
  kode_program: string;
  program: string;
  is_locked: boolean;
  indikators: RenjaPenetapanIndikator[];
  pagu_anggaran: number | null;
}

export interface RenjaPenetapanKegiatan {
  id: number;
  kode_kegiatan: string;
  kegiatan: string;
  is_locked: boolean;
  indikators: RenjaPenetapanIndikator[];
  pagu_anggaran: number | null;
}

export interface RenjaPenetapanSubkegiatan {
  id: number;
  kode_subkegiatan: string;
  subkegiatan: string;
  is_locked: boolean;
  indikators: RenjaPenetapanIndikator[];
  pagu_anggaran: number | null;
}

export interface RenjaPenetapanResponse {
  kode_opd: string;
  tahun: number;
  bulan: number;
  programs: RenjaPenetapanProgram[];
  kegiatans: RenjaPenetapanKegiatan[];
  subkegiatans: RenjaPenetapanSubkegiatan[];
}
