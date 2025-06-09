import React from 'react';

type TargetColProps = {
  target: string;
  satuan: string;
};

const TargetCol: React.FC<TargetColProps> = ({ target, satuan }) => {

  return (
    <React.Fragment>
      <td className="border border-red-400 px-6 py-4 text-center">{target}</td>
      <td className="border border-red-400 px-6 py-4 text-center">- realisasi -</td>
      <td className="border border-red-400 px-6 py-4 text-center">{satuan}</td>
      <td className="border border-red-400 px-6 py-4 text-center">- capaian -</td>
    </React.Fragment>
  );
}

export default TargetCol;
