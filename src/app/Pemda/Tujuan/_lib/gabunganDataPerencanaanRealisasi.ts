import {
  PerencanaanTujuanPemdaResponse,
  RealisasiTujuanResponse,
  TargetRealisasiCapaian,
} from '@/types';

export function gabunganDataPerencanaanRealisasi(perencanaan: PerencanaanTujuanPemdaResponse['data'], realisasi: RealisasiTujuanResponse): TargetRealisasiCapaian[] {
  const hasil: TargetRealisasiCapaian[] = [];
  // Iterate through each planning item
  perencanaan.forEach(item => {
    item.tujuan_pemda.forEach(tujuan => {
      tujuan.indikator.forEach(indikator => {
        // Look for targets in the current indicator
        const targets = indikator.target;

        targets.forEach(target => {
          // Find corresponding realization for the target year and tujuanId
          const realizationEntry = realisasi.find(r =>
            r.tahun === target.tahun &&
            r.indikatorId === indikator.id &&
            r.tujuanId === tujuan.id.toString() &&
            r.targetId === target.id
          );

          if (realizationEntry) {
            hasil.push({
              targetRealisasiId: realizationEntry.id,
              tujuanPemda: tujuan.tujuan_pemda,
              tujuanId: tujuan.id.toString(),
              indikatorId: indikator.id.toString(),
              indikator: indikator.indikator,
              targetId: target.id,
              target: target.target,
              realisasi: realizationEntry.realisasi,
              capaian: realizationEntry.capaian,
              satuan: target.satuan,
              tahun: target.tahun
            });
          } else {
            hasil.push({
              targetRealisasiId: null,
              tujuanPemda: tujuan.tujuan_pemda,
              tujuanId: tujuan.id.toString(),
              indikatorId: indikator.id.toString(),
              indikator: indikator.indikator,
              targetId: target.id,
              target: target.target,
              realisasi: 0,
              capaian: '',
              satuan: target.satuan,
              tahun: target.tahun
            });
          }
        });
      });
    });
  });

  return hasil;
}
