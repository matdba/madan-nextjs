"use client";

import { useEffect } from "react";
import CustomButton from "../widgets/CustomButton";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDestructive: boolean;
  title: string;
  message: string;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  isDestructive = false,
  title,
  message,
  loading = false,
}: ConfirmDialogProps) {
  // Close drawer on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-90"
          onClick={onClose}
        />
      )}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-100 p-4">
          <div className="bg-white rounded-3xl shadow-3xl max-w-md w-full border border-gray-100 transform transition-all">
            <div className="p-6">
              {/* <div className="flex items-center justify-center mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? "bg-red-50" : "bg-indigo-50"
                    }`}
                >
                  {isDestructive ? <CloseCircle className="w-6 h-6 text-red-400" /> : <CheckCircle className="w-6 h-6 text-accent" />}
                </div>
              </div> */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
              <p className="text-gray-600 text-center mb-6">{message}</p>
              <div className="flex gap-3 justify-center items-center">
                <CustomButton
                  title='انصراف'
                  onClick={onClose}
                  background='bg-gray-light dark:bg-gray-dark'
                  foreground="" />

                <CustomButton
                  title='تائید'
                  onClick={onConfirm}
                  loading={loading}
                  background={isDestructive ? 'bg-red-400' : 'bg-accent'}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>

  );
}
