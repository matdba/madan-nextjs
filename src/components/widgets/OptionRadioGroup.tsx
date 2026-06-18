"use client";

export type RadioOption = {
  value: string;
  label: string;
};

type OptionRadioGroupProps = {
  // label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  // icon?: ReactElement<{ className?: string }>;
};

export default function OptionRadioGroup({
  // label,
  value,
  onChange,
  options,
  // icon,
}: OptionRadioGroupProps) {
  return (
    <div className="space-y-2">
      {/* <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span>{label}</span>
      </div> */}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors cursor-pointer
                ${isActive
                  ? "bg-primary text-white border-primary"
                  : "bg-background-light dark:bg-background-dark text-gray-600 border-gray-light dark:border-gray-dark hover:bg-secondary/10"
                }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
