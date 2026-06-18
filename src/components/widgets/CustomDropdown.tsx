"use client";

import { AltArrowDown } from "@solar-icons/react";
import { cloneElement, ReactElement, useMemo, useRef, useState } from "react";

export type CustomOption = {
	value: string | number;
	label: string;
};

type CustomDropdownProps = {
	value: string | number | null;
	onChange: (value: string | number) => void;
	// loadOptions?: () => Promise<Option[]>;
	options: CustomOption[];
	placeholder?: string;
	className?: string;
	background?: string;
	error?: string;
	defaultOption?: CustomOption;
	icon?: ReactElement<{ className?: string }>;
};

export default function CustomDropdown({
	value,
	onChange,
	options,
	placeholder = "",
	className = "",
	background = "bg-white dark:bg-background-dark",
	error,
	icon,
}: CustomDropdownProps) {

	const iconWithStyles = icon !== undefined ? cloneElement(icon, {
		className: "w-5 h-5 text-gray-400"
	}) : null;

	const [isOpen, setIsOpen] = useState(false);
	// const [options, setOptions] = useState<Option[]>([]);
	// const [isLoading, setIsLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [isFiltering, setIsFiltering] = useState(false);

	// const hasFetchedRef = useRef(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const selectedOption = options.find((opt) => opt.value === value) ?? null;

	// 🔴 Lazy load on first open/focus
	// useEffect(() => {
	// if (!isOpen) return;
	// if (!options) return;
	// if (hasFetchedRef.current) return;

	// const fetchOptions = async () => {
	// 	try {
	// 		hasFetchedRef.current = true;
	// 		setIsLoading(true);

	// 		const data = await loadOptions();
	// 		setOptions(data);
	// 	} catch (err) {
	// 		console.error("Dropdown loadOptions failed:", err);
	// 		hasFetchedRef.current = false;
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	// fetchOptions();
	// }, [isOpen, options]);


	// 🔎 Filter
	const filteredOptions = useMemo(() => {
		if (!search.trim()) return options;

		const q = search.toLowerCase();
		return options.filter((opt) =>
			opt.label.toLowerCase().includes(q)
		);
	}, [options, search]);

	const inputValue = isFiltering
		? search
		: selectedOption?.value === 0
			? ""
			: selectedOption?.label ?? "";

	const visibleOptions = isFiltering ? filteredOptions : options;

	// ✅ Exact match check
	const findExactMatch = (text: string) => {
		return options.find(
			(opt) => opt.label === text
		);
	};

	// On blur: validate or reset
	const handleBlur = () => {
		// small timeout so click on option still works
		setTimeout(() => {
			if (!isFiltering) {
				setIsOpen(false);
				return;
			}
			if (selectedOption?.value != 0) {
				const exact = findExactMatch(search);

				if (exact) {
					onChange(exact.value);
					setSearch(exact.label);
				} else {
					// ❌ invalid or incomplete → reset
					setSearch(selectedOption?.label ?? "");
				}
			} else {
				setSearch("");
			}
			setIsFiltering(false);
			setIsOpen(false);
		}, 150);
	};

	const handleFocus = () => {
		setIsOpen(true);
		setIsFiltering(false);
		// Ensure selection after focus is applied
		requestAnimationFrame(() => {
			inputRef.current?.select();
		});
	};

	return (
		<div className={`relative ${className}`}>
			<div
				className={`w-full flex items-center px-4 py-3 border min-w-32
	          ${error ? "border-red-500" : "border-gray-light dark:border-gray-dark"} rounded-full ${background}
	          focus-within:ring-1 focus-within:ring-primary transition-colors duration-200`}
				onClick={() => {
					inputRef.current?.focus();
					setIsOpen(true);
				}}
			>
					<input
						ref={inputRef}
						type="text"
						name="dropdown-search"
						value={inputValue}
					placeholder={placeholder}
					autoComplete="new-password"
					autoCorrect="off"
					autoCapitalize="none"
					spellCheck={false}
					onChange={(e) => {
						setSearch(e.target.value);
						setIsFiltering(true);
						setIsOpen(true);
					}}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className="w-full bg-transparent outline-none text-base md:text-sm font-medium text-right pr-6
						placeholder-gray-400 placeholder:text-base md:placeholder:text-sm placeholder:font-normal"
				/>
				<div className="absolute inset-y-0 right-0 mr-2 mt-2 flex items-center justify-center pointer-events-none w-8 h-8">
					{iconWithStyles}
				</div>

				<AltArrowDown
					className={`w-4 h-4 mr-2 transition-transform ${isOpen ? "rotate-180" : "rotate-0"
						}`}
				/>
			</div>

			{isOpen && (
				<div className="absolute z-20 w-full text-sm mt-2 left-0 p-2 bg-white dark:bg-background-dark rounded-4xl border border-gray-light dark:border-gray-dark max-h-60 overflow-y-auto">
					{/* {isLoading && (
						<div className="px-4 py-3 text-center text-gray-400">
							در حال بارگذاری...
						</div>
					)} */}

					{filteredOptions.length === 0 && (
						<div className="px-4 py-3 text-center text-gray-400">
							نتیجه ای یافت نشد
						</div>
					)}

					{filteredOptions && visibleOptions.map((option) => (
						<button
							key={option.value}
							type="button"
							onMouseDown={(e) => e.preventDefault()} // prevent blur before click
							onClick={() => {
								onChange(option.value);
								setSearch(option.label);
								setIsFiltering(false);
								setIsOpen(false);
							}}
							className={`w-full px-4 py-3 font-medium rounded-full text-right hover:bg-secondary/20 transition-colors
                ${(value === option.value)
									? "bg-primary/10 text-primary"
									: ""
								}`}
						>
							{option.label}
						</button>
					))}
				</div>
			)}

				{error !== undefined && <p className={`mt-1 text-xs mr-4 flex items-center gap-1 ${error ? "text-red-500" : "text-transparent"}`}>
					{error || "-"}
				</p>}
		</div>
	);
}
