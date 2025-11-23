import {
  InfoOpd,
  TujuanOpdRealisasiResponse,
  TujuanOpdTargetRealisasiCapaian,
} from "@/types";

export function gabunganDataPerencanaanRealisasi(
  perencanaan: InfoOpd,
  realisasi: TujuanOpdRealisasiResponse,
): TujuanOpdTargetRealisasiCapaian[] {
  const hasil: TujuanOpdTargetRealisasiCapaian[] = [];

  // Safety check
  if (!perencanaan?.tujuan_opd) {
    console.log(perencanaan.kode_opd)
    return hasil;
  }

  // --- OPTIMASI ---
  // Buat map untuk lookup realisasi O(1)
  const realisasiMap = new Map<string, (typeof realisasi)[number]>();
  console.log('here')

  realisasi.forEach((r) => {
    const key = `${r.tahun}-${r.tujuanId}-${r.indikatorId}-${r.targetId}`;
    realisasiMap.set(key, r);
  });

  // --- PROSES GABUNGAN ---
  perencanaan.tujuan_opd.forEach((tujuan) => {
    tujuan.indikator?.forEach((indikator) => {
      indikator.target?.forEach((target) => {
        const key = `${target.tahun}-${tujuan.id_tujuan_opd}-${indikator.id}-${target.id}`;
        const real = realisasiMap.get(key);

        hasil.push({
          targetRealisasiId: real?.id ?? null,
          tujuanOpd: tujuan.tujuan,
          tujuanId: tujuan.id_tujuan_opd,
          indikatorId: indikator.id.toString(),
          indikator: indikator.indikator,
          targetId: target.id,
          target: target.target,
          realisasi: real?.realisasi ?? 0,
          capaian: real?.capaian ?? "-",
          satuan: target.satuan,
          tahun: target.tahun,
          kodeOpd: perencanaan.kode_opd,
        });
      });
    });
  });

  return hasil;
}
