import React, { useState, useEffect } from "react";
import FormLogin from "./FormLogin";
import { TbLogin } from "react-icons/tb";

interface LoginButtonProps {
  autoOpen: boolean;
}

export default function LoginButton({ autoOpen = false }: LoginButtonProps) {
  const [ModalLogin, setModalLogin] = useState(false);

  useEffect(() => {
    if (autoOpen) {
      setModalLogin(true);
    }
  }, [autoOpen]);

  return (
    <div>
      <button
        className="flex items-center gap-2 font-bold rounded-lg cursor-pointer py-1 px-5 hover:text-black text-white hover:bg-white border border-white"
        onClick={() => setModalLogin(true)}
      >
        <TbLogin />
        LOGIN
      </button>

      {ModalLogin && (
        <FormLogin
          onClose={() => setModalLogin(false)}
          onSuccess={() => {}}
        />
      )}
    </div>
  );
}
