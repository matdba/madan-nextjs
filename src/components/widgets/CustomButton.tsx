import React from "react";

interface CustomButtonProps {
    onClick?: () => void;
    title?: string;
    icon?: React.ReactNode;
    lowHeight?: boolean;
    background?: string;
    foreground?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    loading?: boolean;
    minWidth?: string;
}

export default function CustomButton({
    onClick,
    title,
    icon,
    lowHeight = false,
    background = "bg-primary",
    foreground = "text-black",
    disabled = false,
    type = "button",
    loading = false,
    minWidth = "min-w-40",
}: CustomButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`${minWidth} px-4 rounded-full text-base md:text-sm cursor-pointer font-semibold disabled:opacity-30
                disabled:cursor-not-allowed transition-all flex items-center justify-self-center justify-center gap-2
                shadow-xs bg-opacity-90 hover:bg-opacity-100 ${background} ${foreground} ${lowHeight ? "py-2" : "py-3"}`}
        >
            {loading && (
                <div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                />
            )}

            {!loading && icon}
            {!loading && title}
        </button>
    );
}
