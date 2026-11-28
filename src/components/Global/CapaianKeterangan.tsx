import { TbCheck } from "react-icons/tb";
import type { ReactNode } from "react";

type CapaianKeteranganProps = {
  children: ReactNode;
};

export default function CapaianKeterangan({ children }: CapaianKeteranganProps) {
  return (
    <div className="flex flex-col gap-1">
      <span>{children}</span>
      <span className="mt-1 border-t border-gray-200 pt-1 text-sm">
        Bukti pendukung sudah diupload
      </span>
      <TbCheck className="h-5 w-5 self-center text-green-500" aria-label="Bukti pendukung sudah diupload" />
    </div>
  );
}
