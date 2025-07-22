import {
    PerencanaanSasaranPemdaResponse,
    RealisasiSasaranResponse,
    TargetRealisasiCapaianSasaran,
} from '@/types';

export function gabunganDataPerencanaanRealisasi(perencanaan: PerencanaanSasaranPemdaResponse['data'], realisasi: RealisasiSasaranResponse): TargetRealisasiCapaianSasaran[] {
    const hasil: TargetRealisasiCapaianSasaran[] = [];
    // Iterate through each planning item
    perencanaan.forEach(sasaran => {
        sasaran.indikator.forEach(indikator => {
            // Look for targets in the current indicator
            indikator.target?.forEach(target => {
                // Find corresponding realization for the target year and tujuanId
                const realizationEntry = realisasi.find(r =>
                    r.tahun === target.tahun &&
                    r.sasaranId === sasaran.id.toString() &&
                    r.indikatorId === indikator.id &&
                    r.targetId === target.id
                );

                if (realizationEntry) {
                    hasil.push({
                        targetRealisasiId: realizationEntry.id,
                        sasaranPemda: sasaran.sasaran_pemda,
                        sasaranId: sasaran.id.toString(),
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
                        sasaranPemda: sasaran.sasaran_pemda,
                        sasaranId: sasaran.id.toString(),
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

    return hasil;
}
