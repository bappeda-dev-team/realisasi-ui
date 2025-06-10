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
            r.tujuanId === tujuan.id.toString() // Ensure proper matching
          );

          // If there is a realization entry, create TargetRealisasiCapaian
          if (realizationEntry) {
            hasil.push({
              targetRealisasiId: target.id,
              tujuanId: tujuan.id.toString(), // Ensure the type is consistent
              indikatorId: indikator.id.toString(),
              target: target.target,         // Convert to number
              realisasi: realizationEntry.realisasi.toString(),
              capaian: '100%',
              satuan: target.satuan,
              tahun: target.tahun
            });
          } else {
            hasil.push({
              targetRealisasiId: target.id,
              tujuanId: tujuan.id.toString(), // Ensure the type is consistent
              indikatorId: indikator.id.toString(),
              target: target.target,         // Convert to number
              realisasi: '-',
              capaian: '-',
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
