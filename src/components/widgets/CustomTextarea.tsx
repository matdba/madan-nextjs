import * as persianTools from "@persian-tools/persian-tools";

type CustomTextareaProps = {
  value: string | number;
  setValue: (value: string) => void;
  handleAction: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  moneyInput?: boolean;
  maxLength?: number;
  disabled?: boolean;
  rows?: number;
  background?: string;
};

export default function CustomTextarea({
  value,
  setValue,
  handleAction,
  placeholder,
  error = "",
  moneyInput = false,
  maxLength = 500,
  disabled = false,
  rows = 4,
  background = "bg-white dark:bg-background-dark",
}: CustomTextareaProps) {

  const formatNumber = (value: string | number) => {
    if (!value) return "";
    const number = value.toString().replace(/\D/g, "");
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;

    if (moneyInput) {
      inputValue = persianTools.digitsFaToEn(inputValue);
      const cleanValue = inputValue.replace(/[^\d,]/g, "");
      const rawNumber = cleanValue.replace(/,/g, "");
      setValue(rawNumber);
    } else {
      setValue(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          placeholder={placeholder}
          value={moneyInput ? formatNumber(value) : value}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          rows={rows}
          className={`w-full px-4 py-3 ${background} border border-gray-light dark:border-gray-dark rounded-2xl text-base md:text-sm font-medium text-right
            placeholder-gray-400 placeholder:text-base md:placeholder:text-sm placeholder:font-normal
            focus:outline-none focus:ring-1 focus:ring-primary
            transition-all duration-200 resize-none`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              e.preventDefault();
              handleAction(e);
            }
          }}
        />
      </div>

      <p className={`text-xs mt-1 mr-4 flex items-center gap-1 ${error ? "text-red-500" : "text-transparent"}`}>
        {error || "-"}
      </p>
    </div>
  );
}
