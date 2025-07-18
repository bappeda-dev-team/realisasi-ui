import React from 'react';
import { ButtonRed } from "@/components/Global/Button/button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children?: React.ReactElement<HTMLFormElement>;
}

export function FormModal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-4/5">
                <div className="w-max-[500px] py-2 my-2 border-b">
                    <h1 className="text-xl uppercase">{title}</h1>
                </div>
                {children}
                <ButtonRed className="w-full mt-5" type="button" onClick={onClose}>
                    Batal
                </ButtonRed>
            </div>
        </div>
    )
}
