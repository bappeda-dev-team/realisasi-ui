import React from 'react';

type TargetColProps = {
  target: string;
  realisasi: string;
  satuan: string;
  capaian: string;
};

const TargetCol: React.FC<TargetColProps> = ({ target, realisasi, satuan, capaian }) => {

  return (
    <React.Fragment>
      <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
      <td className="border border-red-400 px-6 py-4 text-center">{realisasi}</td>
      <td className="border border-red-400 px-6 py-4 text-center">{satuan}</td>
      <td className="border border-red-400 px-6 py-4 text-center">{capaian}</td>
    </React.Fragment>
  );
}

export default TargetCol;
