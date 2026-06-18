import * as persianTools from "@persian-tools/persian-tools";
import { cloneElement, ReactElement } from "react";

type CustomInputProps = {
	icon: ReactElement<{ className?: string }>;
	value: string | number;
	background?: string;
	setValue: (value: string) => void;
	handleAction: (e: React.KeyboardEvent<HTMLInputElement>) => void;
	placeholder?: string;
	type?: "text" | "password" | "number";
	error?: string;
	moneyInput?: boolean;
	maxLength?: number;
	disabled?: boolean;
};

export default function CustomInput({
	value,
	setValue,
	handleAction,
	placeholder,
	background = 'bg-white dark:bg-background-dark',
	type = "text",
	error = "",
	moneyInput = false,
	maxLength = 50,
	disabled = false,
	icon,
}: CustomInputProps) {

	const iconWithStyles = cloneElement(icon, {
		className: "w-5 h-5 text-gray-400"
	});

	const formatNumber = (value: string | number) => {
		if (!value) return "";
		const number = value.toString().replace(/\D/g, "");
		return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let inputValue = e.target.value;

		if (moneyInput) {
			inputValue = persianTools.digitsFaToEn(inputValue);
			const cleanValue = inputValue.replace(/[^\d,]/g, "");
			const rawNumber = cleanValue.replace(/,/g, "");
			setValue(rawNumber);
		}
		else if (type === "password") {
			const cleaned = inputValue.replace(
				/[^A-Za-z0-9!@#$%^&*(),.?":{}|<>_\-+=;'/\\[\]`~]/g,
				""
			);
			setValue(cleaned);
		}
		else if (type === "number") {
			inputValue = persianTools.digitsFaToEn(inputValue);
			const numericValue = inputValue.replace(/[^0-9]/g, "");
			setValue(numericValue);
		}
		else {
			setValue(inputValue);
		}
	};

	return (
		<div className="space-y-1">
			<div className="relative">
				<input
					type={type === "password" ? "password" : "text"}
					placeholder={placeholder}
					value={moneyInput ? formatNumber(value) : value}
					onChange={handleChange}
					onFocus={(e) => setValue(e.target.value)}
					disabled={disabled}
					inputMode={type === "number" ? "numeric" : "text"}
					maxLength={maxLength}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleAction(e);
					}}
					className={`${error ? "border-red-500" : "border-gray-light dark:border-gray-dark"}
						w-full px-10 py-3 border rounded-4xl text-base md:text-sm font-medium text-right
						${disabled ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed" : background}
						placeholder-gray-400 placeholder:text-base md:placeholder:text-sm placeholder:font-normal focus:outline-none focus:ring-1
						focus:ring-primary transition-all duration-200`}
				/>
				<div className="absolute inset-y-0 right-0 mr-2 mt-2 flex items-center justify-center pointer-events-none w-8 h-8">
					{iconWithStyles}
				</div>
			</div>

			<p className={`text-xs mr-4  ${error ? "text-red-500" : "text-transparent"}`}>
				{error || "-"}
			</p>
		</div>
	);
}
