import { ClipLoader } from 'react-spinners';

interface Button {
  loading?: boolean;
  color?: string;
}

export const LoadingButtonClip:React.FC<Button> = ({ loading, color }) => {
  return (
    <div className="mr-2 flex flex-col items-center justify-center z-50">
      <ClipLoader color={`${color}`} loading={loading} size={15} />
    </div>
  );
};