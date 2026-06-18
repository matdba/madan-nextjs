"use client";

import { useState } from "react";
import { forwardRef, useImperativeHandle, useRef } from "react";


type Option = {
  value: string | number;
  label: string;
};

type CustomDropdownProps = {
  options: Option[];
  value: string | number | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  background?: string;
  // icon?: ReactElement<{ className?: string }> | null;  // ← FIX HERE
};

export type SimpleDropdownHandle = {
  open: () => void;
  focus: () => void;
};

const SimpleDropDown = forwardRef<SimpleDropdownHandle, CustomDropdownProps>(function CustomDropdown({
  options,
  value,
  onChange,
  placeholder = "",
  className = "",
  background = 'bg-background-light dark:bg-background-dark',
}, ref) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value) ?? '';
  const buttonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
      buttonRef.current?.focus();
    },
    focus: () => {
      buttonRef.current?.focus();
    },
  }));


  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`text-sm flex items-center justify-between py-0 border w-14 border-gray-light dark:border-gray-dark
          rounded-full ${background} hover:bg-secondary/20 focus:outline-none
          focus:border-primary transition-all duration-200
          ${selectedOption === '' ? 'text-gray-400' : 'text-card-dark dark:text-card-light'}`}
      >
        {/* <AltArrowDown className={`w-4 h-4 mr-1 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`} /> */}
        <span className={`truncate text-center flex-1 font-medium text-lg ${selectedOption ? "text-lg" : "text-md"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute z-20 w-full text-sm mt-2 left-0 p-2 bg-white dark:bg-background-dark rounded-2xl border border-gray-light dark:border-gray-dark max-h-60 overflow-y-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value as string);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 font-medium rounded-2xl text-center hover:bg-secondary/20 transition-colors ${value === option.value ? "bg-primary/10 text-primary" : ""
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});

export default SimpleDropDown;
