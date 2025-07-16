import {
    PerencanaanSasaranPemdaResponse,
    RealisasiSasaranResponse,
    TargetRealisasiCapaian,
} from '@/types';

export function gabunganDataSasaranRealisasi(sasaran: PerencanaanSasaranPemdaResponse['data'], realisasi: RealisasiSasaranResponse): TargetRealisasiCapaian[] {
    const hasil: TargetRealisasiCapaian[] = [];
    console.log('Sasaran: ', sasaran)
    console.log('Realisasi: ', realisasi)

    return hasil;
}
