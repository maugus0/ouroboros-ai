import { useEffect, useRef, useState } from "react";
import { ALLOWED_COUNTRIES, type CountryCode } from "@/types/auth";
import { formatForDisplay } from "@/utils/phoneUtils";
import { ChevronDown } from "lucide-react";

interface PhoneInputProps {
  value: string;
  countryCode: CountryCode;
  onChange: (value: string) => void;
  onCountryChange: (country: CountryCode) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

export function PhoneInput({
  value,
  countryCode,
  onChange,
  onCountryChange,
  onBlur,
  error,
  disabled = false,
  placeholder = "Phone number",
  id = "phone-input",
}: PhoneInputProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value.replace(/\D/g, ""));
  };

  return (
    <div className="space-y-1">
      <div className="flex">
        {/* Country code selector */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={disabled}
            className={`flex items-center gap-1 rounded-l-lg border border-r-0 bg-muted/50 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-destructive" : "border-input"}`}
          >
            <span className="text-lg">{countryCode.flag}</span>
            <span className="text-muted-foreground">{countryCode.dialCode}</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-56 rounded-lg border bg-popover shadow-lg">
              <div className="max-h-60 overflow-auto py-1">
                {ALLOWED_COUNTRIES.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onCountryChange(country);
                      setIsDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground ${country.code === countryCode.code ? "bg-accent/50" : ""}`}
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="flex-1 text-left">{country.name}</span>
                    <span className="text-muted-foreground">{country.dialCode}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Phone number input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          value={formatForDisplay(value)}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`flex-1 rounded-r-lg border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-destructive focus:ring-destructive" : "border-input"}`}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
