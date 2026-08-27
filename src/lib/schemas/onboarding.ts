import { parsePhoneNumberFromString } from "libphonenumber-js";
import z from "zod";

/** Only "+1" followed by exactly 10 digits — no spaces, dashes, or other special characters. */
const PHONE_FORMAT_REGEX = /^\+1\d{10}$/;
const PHONE_ERROR_MESSAGE =
  "Enter a valid Canadian phone number starting with +1";
export const CORPORATION_NUMBER_LENGTH = 9;
export const NAME_MAX_LENGTH = 50;

/**
 * True for a valid Canadian number. "+1" is shared across NANP countries, so
 * libphonenumber resolves the country from the area code (e.g. 416 → CA, 212 → US).
 */
export function isCanadianPhoneNumber(value: string): boolean {
  const phone = parsePhoneNumberFromString(value);
  return phone?.country === "CA" && phone.isValid();
}

const nameSchema = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(
      NAME_MAX_LENGTH,
      `${label} must be at most ${NAME_MAX_LENGTH} characters`,
    );

/**
 * Synchronous, side-effect-free validation rules. The corporation number is
 * only checked for shape here; the API lookup is layered on at the form layer
 * (see `useOnboardingResolver`) so this schema is usable anywhere, including
 * on the server and in tests without network stubs.
 */
export const onboardingFormSchema = z.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(PHONE_FORMAT_REGEX, PHONE_ERROR_MESSAGE)
    .refine(isCanadianPhoneNumber, PHONE_ERROR_MESSAGE),
  corporationNumber: z
    .string()
    .trim()
    .min(1, "Corporation number is required")
    .length(
      CORPORATION_NUMBER_LENGTH,
      `Corporation number must be ${CORPORATION_NUMBER_LENGTH} characters`,
    ),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
