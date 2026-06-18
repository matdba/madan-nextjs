import { useImperativeHandle, forwardRef, useRef, useState } from "react";
import * as persianTools from "@persian-tools/persian-tools";
import SimpleDropDown, { SimpleDropdownHandle } from "./SimpleDropDown";

export type PlaqueInputHandle = {
  getValue: () => string;
};

type PlaqueInputProps = {
  onValueChange: (valA: string, valB: string, valC: string, valD: string) => void;
  error?: string;
  initialValues?: [string, string, string, string];
  // handleAction?: () => void;
};

const PLAQUE_LETTERS = [
  { value: "الف", label: "الف" },
  { value: "ب", label: "ب" },
  { value: "پ", label: "پ" },
  { value: "ت", label: "ت" },
  { value: "ث", label: "ث" },
  { value: "ج", label: "ج" },
  { value: "د", label: "د" },
  { value: "ز", label: "ز" },
  { value: "س", label: "س" },
  { value: "ش", label: "ش" },
  { value: "ص", label: "ص" },
  { value: "ط", label: "ط" },
  { value: "ع", label: "ع" },
  { value: "ف", label: "ف" },
  { value: "ق", label: "ق" },
  { value: "ک", label: "ک" },
  { value: "گ", label: "گ" },
  { value: "ل", label: "ل" },
  { value: "م", label: "م" },
  { value: "ن", label: "ن" },
  { value: "و", label: "و" },
  { value: "هـ", label: "هـ" },
  { value: "ی", label: "ی" },
];


const PlaqueInput = forwardRef<PlaqueInputHandle, PlaqueInputProps>(
  ({ onValueChange, error, initialValues }, ref) => {
    const [values, setValues] = useState<string[]>(
      initialValues ?? new Array(4).fill("")
    );


    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const letterRef = useRef<SimpleDropdownHandle | null>(null);


    useImperativeHandle(ref, () => ({
      getValue: () => values.join(""),
    }));

    const focusIndex = (index: number) => {
      if (index == 1) {
        letterRef.current?.open();
      } else {
        inputRefs.current[index]?.focus();
      }
    };


    const handleDigitChange = (value: string, index: number, length: number) => {
      const inputValue = persianTools.digitsFaToEn(value);
      const numericValue = inputValue.replace(/[^0-9]/g, "");

      const newArr = [...values];
      newArr[index] = numericValue;

      setValues(newArr);
      onValueChange(newArr[0], newArr[1], newArr[2], newArr[3]);

      if (numericValue && value.length === length) {
        focusIndex(index + 1);
      }
    };


    const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (e.key !== "Backspace") return;
      e.preventDefault();

      const newArr = [...values];

      if (newArr[index] === "" && index > 0) {
        if (index === 2) {
          newArr[0] = newArr[0].slice(0, -1);
          focusIndex(0);
        } else {
          newArr[2] = newArr[2].slice(0, -1);
          focusIndex(2);
        }
        setValues(newArr);
        onValueChange(newArr[0], newArr[1], newArr[2], newArr[3]);
      } else {
        newArr[index] = newArr[index].slice(0, -1);
        setValues(newArr);
        onValueChange(newArr[0], newArr[1], newArr[2], newArr[3]);
      }
    };


    const handleLetterChange = (letter: string) => {
      const newArr = [...values];
      newArr[1] = letter;

      setValues(newArr);
      onValueChange(newArr[0], newArr[1], newArr[2], newArr[3]);

      // auto move forward after letter
      focusIndex(2);
    };

    return (
      <div>
        <div className={`flex max-w-fit items-end gap-2 px-4 py-1.5 text-sm border
          font-medium bg-card-light dark:bg-card-dark rounded-full
          ${error ? "border-red-500" : "border-gray-light dark:border-gray-dark"}`} dir="ltr">

          {/* 2 digits */}
          <input
            value={values[0]}
            maxLength={2}
            onChange={(e) => handleDigitChange(e.target.value, 0, 2)}
            onKeyDown={(e) => handleBackspace(e, 0)}
            onFocus={() => onValueChange(values[0], values[1], values[2], values[3])}
            ref={(el) => { inputRefs.current[0] = el; }}
            className="w-10 h-6 bg-gbackground-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-dark text-center text-xl font-semibold text-card-dark dark:text-card-light focus:outline-none  focus:border-primary transition-all duration-200"
            type="text"
            dir="ltr"
          />

          {/* Letter */}
          <SimpleDropDown
            value={values[1] || null}
            options={PLAQUE_LETTERS}
            onChange={handleLetterChange}
            placeholder="حرف"
            ref={letterRef}
          />

          {/* 3 digits */}
          <input
            value={values[2]}
            maxLength={3}
            onChange={(e) => handleDigitChange(e.target.value, 2, 3)}
            onKeyDown={(e) => handleBackspace(e, 2)}
            ref={(el) => { inputRefs.current[2] = el; }}
            onFocus={() => onValueChange(values[0], values[1], values[2], values[3])}
            className="w-12 h-6 bg-gbackground-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-dark text-center text-xl font-semibold text-card-dark dark:text-card-light focus:outline-none  focus:border-primary transition-all duration-200"
            type="text"
            dir="ltr"
          />

          <div className="w-0 h-6 border-l border-gray-600"></div>


          {/* 2 digits */}
          <input
            value={values[3]}
            maxLength={2}
            onChange={(e) => handleDigitChange(e.target.value, 3, 2)}
            onKeyDown={(e) => handleBackspace(e, 3)}
            ref={(el) => { inputRefs.current[3] = el; }}
            onFocus={() => onValueChange(values[0], values[1], values[2], values[3])}
            className="w-10 h-6 bg-gbackground-light dark:bg-background-dark border-b border-gray-200 dark:border-gray-dark text-center text-xl font-semibold text-card-dark dark:text-card-light focus:outline-none  focus:border-primary transition-all duration-200"
            type="text"
            dir="ltr"
          />
        </div>
        <p className={`text-xs mt-1 mr-4 flex items-center gap-1 ${error ? "text-red-500" : "text-transparent"}`}>
          {error ? error : "-"}
        </p>
      </div>
    );
  }
);

PlaqueInput.displayName = "PlaqueInput";

export default PlaqueInput;

