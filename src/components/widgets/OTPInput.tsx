import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import * as persianTools from "@persian-tools/persian-tools";

type OTPInputProps = {
  numberOfDigits: number;
  error?: string;
  onValueChange: (array: Array<string>) => void;
  handleAction: () => void;
};

export type OTPInputHandle = {
  getOtp: () => string;
};

const OTPInput = forwardRef<OTPInputHandle, OTPInputProps>(({ numberOfDigits = 4, error, onValueChange, handleAction }, ref) => {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const otpBoxReference = useRef<(HTMLInputElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    getOtp: () => {
      // For RTL display but LTR data order, reverse the array before joining
      return [...otp].join("");
    },
  }));

  function handleChange(value: string, index: number) {
    const inputValue = persianTools.digitsFaToEn(value);
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    const newArr = [...otp];
    newArr[index] = numericValue;

    console.log(newArr);

    setOtp(newArr);
    onValueChange(newArr);
    // handleFocus(newArr);
    if (numericValue && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1]?.focus();
    }
    if (numericValue && index === numberOfDigits - 1) {
      otpBoxReference.current[index]?.blur();
    }
  }


  function handleBackspaceAndEnter(e: React.KeyboardEvent<HTMLInputElement>, index: number) {

    if (e.key === "Backspace") {
      e.preventDefault();
      const newArr = [...otp];
      if (newArr[index] === "" && index > 0) {
        newArr[index - 1] = "";
        otpBoxReference.current[index - 1]?.focus();
      } else {
        newArr[index] = "";
      }
      setOtp(newArr);
      onValueChange(newArr);
      // handleFocus(newArr);
    }

    if (e.key === "Enter" && index > 0) {
      handleAction()
    }
  }

  function handleFocus(newArr: Array<string>, e?: React.FocusEvent<HTMLInputElement>) {
    e?.preventDefault();
    // console.log(newArr);

    let tempIndex = 0;
    while (tempIndex < numberOfDigits - 1 && newArr[tempIndex] !== "") {
      tempIndex++;
    }
    otpBoxReference.current[tempIndex]?.focus();

  }


  return (
    <div className="space-y-2">
      {/* <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
        <div className="w-8 h-8 text-secondary bg-secondary/5 rounded-full flex items-center justify-center">
          <ShieldMinimalistic className="w-4 h-4 text-secondary" />
        </div>
        کد تائید
      </label> */}
      <div className="flex justify-center gap-2" dir="ltr">

        {otp.map((digit, index) => (
          <input
            key={index}
            value={digit}
            maxLength={1}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleBackspaceAndEnter(e, index)}
            onClick={() => handleFocus(otp)}
            ref={(reference) => { otpBoxReference.current[index] = reference; }}
            className="w-14 h-14 bg-background-light dark:bg-background-dark border border-gray-light dark:border-gray-dark rounded-3xl text-center text-xl font-bold text-card-dark dark:text-card-light focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            dir="ltr"
          />
        ))}
      </div>
      <p className={`text-xs mt-1 mr-4 flex items-center gap-1 ${error ? "text-red-500" : "text-transparent"}`}>
        {error ? error : "-"}
      </p>
    </div>
  );
});

OTPInput.displayName = "OTPInput";

export default OTPInput;
