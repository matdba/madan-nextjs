"use client";

import { useEffect } from "react";

interface LeftDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  width?: string; // e.g., "w-80"
  zIndexClass?: string;
  children: React.ReactNode;
}

export default function LeftDrawer({
  isOpen,
  onClose,
  width = "w-96",
  zIndexClass = "z-100",
  children,
}: LeftDrawerProps) {
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
      {/* Backdrop */}
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-xs ${zIndexClass}`}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 left-0 h-[calc(100vh-1rem)] bg-background-light dark:bg-card-dark shadow-2xl ${zIndexClass} m-2 rounded-3xl
          transform transition-transform duration-300 ease-in-out
          ${width}
          ${isOpen ? "translate-x-0" : "-translate-x-[110%]"}
        `}
      >
        {/* Content */}
        <div className="h-full overflow-y-auto p-4">{children}</div>
      </div>
    </>
  );
}
