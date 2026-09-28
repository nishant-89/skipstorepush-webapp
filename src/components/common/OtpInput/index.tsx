import { ClipboardEvent, KeyboardEvent, useRef } from "react";

type OtpInputProps = {
  value: string;
  length?: number;
  onChange: (value: string) => void;
  onBlur?: () => void;
  errorIndexes?: boolean[];
  disabled?: boolean;
};

export const OTP_EMPTY_SLOT = " ";

export const parseOtpDigits = (value: string, length: number): string[] =>
  Array.from({ length }, (_, index) =>
    /\d/.test(value[index] || "") ? value[index] : ""
  );

export const serializeOtpDigits = (digits: string[], length: number): string =>
  Array.from({ length }, (_, index) =>
    /\d/.test(digits[index] || "") ? digits[index] : OTP_EMPTY_SLOT
  ).join("");

const OtpInput = ({
  value,
  length = 6,
  onChange,
  onBlur,
  errorIndexes = [],
  disabled = false,
}: OtpInputProps) => {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = parseOtpDigits(value, length);

  const focusIndex = (index: number) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  const emitValue = (nextDigits: string[]) => {
    onChange(serializeOtpDigits(nextDigits, length));
  };

  const handleChange = (index: number, raw: string) => {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      const nextDigits = [...digits];
      nextDigits[index] = "";
      emitValue(nextDigits);
      return;
    }

    if (cleaned.length > 1) {
      const nextDigits = [...digits];
      cleaned.split("").forEach((digit, offset) => {
        if (index + offset < length) {
          nextDigits[index + offset] = digit;
        }
      });
      emitValue(nextDigits);
      focusIndex(Math.min(index + cleaned.length, length) - 1);
      return;
    }

    const nextDigits = [...digits];
    nextDigits[index] = cleaned;
    emitValue(nextDigits);
    if (index < length - 1) {
      focusIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        event.preventDefault();
        const nextDigits = [...digits];
        nextDigits[index] = "";
        emitValue(nextDigits);
        return;
      }
      if (index > 0) {
        event.preventDefault();
        const nextDigits = [...digits];
        nextDigits[index - 1] = "";
        emitValue(nextDigits);
        focusIndex(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusIndex(index - 1);
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusIndex(index + 1);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) {
      return;
    }
    const nextDigits = [...digits];
    pasted.split("").forEach((digit, offset) => {
      nextDigits[offset] = digit;
    });
    emitValue(nextDigits);
    focusIndex(Math.min(pasted.length, length) - 1);
  };

  return (
    <div className="otpBoxes" role="group" aria-label="One-time code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-invalid={Boolean(errorIndexes[index])}
          aria-label={`Digit ${index + 1}`}
          className={errorIndexes[index] ? "hasError" : ""}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onBlur={onBlur}
        />
      ))}
    </div>
  );
};

export default OtpInput;
