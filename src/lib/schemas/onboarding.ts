import { parsePhoneNumberFromString } from "libphonenumber-js";
import z from "zod";
import type { CorporationNumberResult } from "@/queries/corporation-number";

/** Only "+1" followed by exactly 10 digits — no spaces, dashes, or other special characters. */
const PHONE_FORMAT_REGEX = /^\+1\d{10}$/;
const PHONE_ERROR_MESSAGE =
  "Enter a valid Canadian phone number starting with +1";
const CORPORATION_NUMBER_LOOKUP_ERROR_MESSAGE =
  "Could not verify corporation number. Please try again.";
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

export type CorporationNumberValidator = (
  number: string,
) => Promise<CorporationNumberResult>;

type OnboardingFormSchemaOptions = {
  /** Async lookup; injected so the schema stays free of network concerns. */
  validateCorporationNumber: CorporationNumberValidator;
};

export function createOnboardingFormSchema({
  validateCorporationNumber,
}: OnboardingFormSchemaOptions) {
  return z.object({
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
      )
      .superRefine(async (number, ctx) => {
        try {
          const result = await validateCorporationNumber(number);
          if (!result.valid)
            ctx.addIssue({ code: "custom", message: result.message });
        } catch {
          ctx.addIssue({
            code: "custom",
            message: CORPORATION_NUMBER_LOOKUP_ERROR_MESSAGE,
          });
        }
      }),
  });
}

export type OnboardingFormValues = z.infer<
  ReturnType<typeof createOnboardingFormSchema>
>;
