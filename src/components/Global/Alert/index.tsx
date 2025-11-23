import React, { useEffect, useState } from "react";
import { TbCheck } from "react-icons/tb";
import { ImCross } from "react-icons/im";


interface ToastProps {
    isOpen: boolean;
    onClose: () => void;
    message: string;
    duration?: number; // default 2000 ms
}

export function ToastSuccess({ isOpen, onClose, message, duration = 2000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)

            const timer = setTimeout(() => {
                setIsVisible(false)

                setTimeout(() => {
                    onClose();
                }, 350);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={`
        fixed top-5 right-5 z-[9999]
        ${isVisible ? "animate-slideIn" : "animate-slideOut"}
      `}
        >
            <div
                className="
          flex items-center gap-3 bg-green-600 text-white
          px-4 py-3 rounded-lg shadow-lg cursor-pointer
          hover:bg-green-700 transition
        "
                onClick={onClose}
            >
                <TbCheck size={22} className="text-white" />
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}

export function ToastError({ isOpen, onClose, message, duration = 5000 }: ToastProps) {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)

            const timer = setTimeout(() => {
                setIsVisible(false)

                setTimeout(() => {
                    onClose();
                }, 350);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className={`
        fixed top-5 right-5 z-[9999]
        ${isVisible ? "animate-slideIn" : "animate-slideOut"}
      `}
        >
            <div
                className="
          flex items-center gap-3 bg-red-500 text-white
          px-4 py-3 rounded-lg shadow-lg cursor-pointer
          hover:bg-red-700 transition
        "
                onClick={onClose}
            >
                <ImCross size={22} className="text-white" />
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}
