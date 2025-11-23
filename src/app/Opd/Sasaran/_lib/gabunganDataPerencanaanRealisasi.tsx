import {
    SasaranOpdPerencanaan, SasaranOpdRealisasiResponse, SasaranOpdTargetRealisasiCapaian
} from '@/types';

export function gabunganDataPerencanaanRealisasi(perencanaan: SasaranOpdPerencanaan[], realisasi: SasaranOpdRealisasiResponse): SasaranOpdTargetRealisasiCapaian[] {
    const hasil: SasaranOpdTargetRealisasiCapaian[] = [];
    // Iterate through each planning item
  perencanaan.forEach(sasaran => {
        sasaran.indikator.forEach(indikator => {
            // Look for targets in the current indicator
            indikator.target?.forEach(target => {
                // Find corresponding realization for the target year and sasaran
                const realizationEntry = realisasi.find(r =>
                    r.tahun === target.tahun &&
                    r.sasaranId === sasaran.id.toString() &&
                    r.indikatorId === indikator.id &&
                    r.targetId === target.id
                );

                if (realizationEntry) {
                    hasil.push({
                        targetRealisasiId: realizationEntry.id,
                        sasaranOpd: sasaran.nama_sasaran_opd,
                        sasaranId: sasaran.id.toString(),
                        indikatorId: indikator.id.toString(),
                        indikator: indikator.indikator,
                        targetId: target.id,
                        target: target.target,
                        realisasi: realizationEntry.realisasi,
                        capaian: realizationEntry.capaian,
                        satuan: target.satuan,
                        tahun: target.tahun,
                        kodeOpd: '-blank-'
                    });
                } else {
                    hasil.push({
                        targetRealisasiId: null,
                        sasaranOpd: sasaran.nama_sasaran_opd,
                        sasaranId: sasaran.id.toString(),
                        indikatorId: indikator.id.toString(),
                        indikator: indikator.indikator,
                        targetId: target.id,
                        target: target.target,
                        realisasi: 0,
                        capaian: "-",
                        satuan: target.satuan,
                        tahun: target.tahun,
                        kodeOpd: '-blank-'
                    });
                }
            });
        });
    });

    return hasil;
}
