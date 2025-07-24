import {
    TujuanOpdPerencanaanResponse, TujuanOpdRealisasiResponse, TujuanOpdTargetRealisasiCapaian
} from '@/types';

export function gabunganDataPerencanaanRealisasi(perencanaan: TujuanOpdPerencanaanResponse['data'], realisasi: TujuanOpdRealisasiResponse): TujuanOpdTargetRealisasiCapaian[] {
    const hasil: TujuanOpdTargetRealisasiCapaian[] = [];
    // Iterate through each planning item
    perencanaan.forEach(opd => {
        opd.tujuan_opd.forEach(tujuan => {
            tujuan.indikator.forEach(indikator => {
                // Look for targets in the current indicator
                indikator.target?.forEach(target => {
                    // Find corresponding realization for the target year and tujuanId
                    const realizationEntry = realisasi.find(r =>
                        r.tahun === target.tahun &&
                        r.tujuanId === tujuan.id_tujuan_opd.toString() &&
                        r.indikatorId === indikator.id &&
                        r.targetId === target.id
                    );

                    if (realizationEntry) {
                        hasil.push({
                            targetRealisasiId: realizationEntry.id,
                            tujuanOpd: tujuan.tujuan,
                            tujuanId: tujuan.id_tujuan_opd,
                            indikatorId: indikator.id.toString(),
                            indikator: indikator.indikator,
                            targetId: target.id,
                            target: target.target,
                            realisasi: realizationEntry.realisasi,
                            capaian: "-",
                            satuan: target.satuan,
                            tahun: target.tahun,
                            kodeOpd: opd.kode_opd
                        });
                    } else {
                        hasil.push({
                            targetRealisasiId: null,
                            tujuanOpd: tujuan.tujuan,
                            tujuanId: tujuan.id_tujuan_opd,
                            indikatorId: indikator.id.toString(),
                            indikator: indikator.indikator,
                            targetId: target.id,
                            target: target.target,
                            realisasi: 0,
                            capaian: "-",
                            satuan: target.satuan,
                            tahun: target.tahun,
                            kodeOpd: opd.kode_opd
                        });
                    }
                });
            });

        })
    });

    return hasil;
}
