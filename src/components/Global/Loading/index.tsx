import React from 'react';
import { ClipLoader, BeatLoader, SyncLoader } from 'react-spinners';

export const LoadingClip = (loading: any) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <ClipLoader color="#1f2937" loading={loading} size={50} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};
export const LoadingBeat = (loading: any) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <BeatLoader color="#1f2937" loading={loading} size={20} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};
export const LoadingSync = (loading: any) => {
  return (
    <div className="px-5 py-3 flex flex-col items-center justify-center z-50">
      <SyncLoader color="#1f2937" loading={loading} size={10} />
      <h1 className='text-gray-800 mt-5 text-2xl uppercase'>Loading</h1>
    </div>
  );
};
export const LoadingButtonClip = (loading: any) => {
  return (
    <div className="mr-2 flex flex-col items-center justify-center z-50">
      <ClipLoader color="#ffffff" loading={loading} size={15} />
    </div>
  );
};
// color ikut parent
export const LoadingButtonClip2 = (loading: any, color: string) => {
  return (
    <div className="mr-2 flex flex-col items-center justify-center z-50">
      <ClipLoader color={`${color}`} loading={loading} size={15} />
    </div>
  );
};
