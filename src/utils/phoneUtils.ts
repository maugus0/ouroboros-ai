import { ALLOWED_COUNTRIES, type CountryCode } from "@/types/auth";

export function formatE164(countryCode: string, phoneNumber: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const cleanCode = countryCode.startsWith("+") ? countryCode : `+${countryCode}`;
  return `${cleanCode}${cleanNumber}`;
}

export function parseE164(e164: string): { countryCode: CountryCode; localNumber: string } | null {
  for (const country of ALLOWED_COUNTRIES) {
    if (e164.startsWith(country.dialCode)) {
      return {
        countryCode: country,
        localNumber: e164.slice(country.dialCode.length),
      };
    }
  }
  return null;
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  return cleanNumber.length >= 6 && cleanNumber.length <= 15;
}

export function formatForDisplay(phoneNumber: string): string {
  const clean = phoneNumber.replace(/\D/g, "");
  return clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function getDefaultCountry(): CountryCode {
  return ALLOWED_COUNTRIES.find((c) => c.code === "SG") ?? ALLOWED_COUNTRIES[0];
}
