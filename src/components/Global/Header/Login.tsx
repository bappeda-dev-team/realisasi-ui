import { TbLogin } from "react-icons/tb";

interface LoginButtonProps {
  onClick: () => void;
}

export default function LoginButton({ onClick }: LoginButtonProps) {
  return (
    <button
      className="flex items-center gap-2 font-bold rounded-lg cursor-pointer py-1 px-5 hover:text-black text-white hover:bg-white border border-white"
      onClick={onClick}
    >
      <TbLogin />
      LOGIN
    </button>
  );
}
