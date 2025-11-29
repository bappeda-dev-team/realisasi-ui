import React, { useState } from "react";
import { useAuthUser } from "@/hooks/useAuthUser";
import { ButtonSky } from "@/components/Global/Button/button";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { LoadingButtonClip } from "@/components/Global/Loading";
import { useUserContext } from "@/context/UserContext";
import { authenticate } from "@/lib/auth";

interface FormLoginProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface LoginRequest {
  username: string;
  password: string;
}

const FormLogin: React.FC<FormLoginProps> = ({ onClose, onSuccess }) => {
  const { submit, loading, error } = useAuthUser<{ sessionId: string }>({
    url: `/auth-api/auth/login`,
  });
  const { setUser } = useUserContext();

  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const [ShowPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await submit(formData);

    if (result?.sessionId) {
      // ambil data user setelah sukses
      // karena di submit atas itu cuma kembalikan
      // sessionId
      const user = await authenticate(result.sessionId);
      setUser(user);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-70"></div>

      <div className="relative bg-white p-5 rounded-lg w-[350px]">
        <h1 className="text-xl mb-4 text-blue-500 font-semibold text-center">
          LOGIN
        </h1>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-500 text-sm text-center mb-2">{error}</p>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            className="w-full border border-blue-500 rounded-lg p-2"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />

          <div className="relative">
            <input
              type={ShowPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full border border-blue-500 rounded-lg p-2"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />

            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center"
              onClick={() => setShowPassword(!ShowPassword)}
            >
              <span className="p-1 rounded-full text-blue-600 hover:bg-blue-400 hover:text-white">
                {ShowPassword ? <TbEye /> : <TbEyeClosed />}
              </span>
            </button>
          </div>

          <ButtonSky type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingButtonClip color="white" />
                Login...
              </span>
            ) : (
              "Login"
            )}
          </ButtonSky>
        </form>
      </div>
    </div>
  );
};

export default FormLogin;
