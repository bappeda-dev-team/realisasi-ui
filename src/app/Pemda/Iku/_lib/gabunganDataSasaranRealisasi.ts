import {
    IkuPemdaPerencanaanResponse,
    IkuPemdaRealisasiResponse,
    IkuPemdaTargetRealisasiCapaian,
} from '@/types';

export function gabunganDataPerencanaanRealisasi(perencanaan: IkuPemdaPerencanaanResponse['data'], realisasi: IkuPemdaRealisasiResponse): IkuPemdaTargetRealisasiCapaian[] {
    const hasil: IkuPemdaTargetRealisasiCapaian[] = [];
    // Iterate through each planning item
    perencanaan.forEach(indikator => {
        // Look for targets in the current indicator
        const targets = indikator.target;

        targets.forEach(target => {
            // Find corresponding realization for the target year and tujuanId
            const realizationEntry = realisasi.find(r =>
                r.tahun === target.tahun &&
                r.indikatorId === indikator.indikator_id &&
                r.targetId === target.id
            );

            if (realizationEntry) {
                hasil.push({
                    targetRealisasiId: realizationEntry.id,
                    indikatorId: indikator.indikator_id,
                    indikator: indikator.indikator,
                    targetId: target.id,
                    target: target.target,
                    realisasi: realizationEntry.realisasi,
                    capaian: realizationEntry.capaian,
                    satuan: target.satuan,
                    tahun: target.tahun,
                    jenisRealisasi: realizationEntry.jenisRealisasi,
                    jenisIku: realizationEntry.jenisIku,
                });
            } else {
                hasil.push({
                    targetRealisasiId: null,
                    indikatorId: indikator.indikator_id,
                    indikator: indikator.indikator,
                    targetId: target.id,
                    target: target.target,
                    realisasi: 0,
                    capaian: '',
                    satuan: target.satuan,
                    tahun: target.tahun,
                    jenisRealisasi: null,
                    jenisIku: null,
                });
            }
        });
    });

    return hasil;
}
