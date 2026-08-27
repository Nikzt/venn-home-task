import z from "zod";

const CORPORATION_NUMBER_URL =
  "https://fe-hometask-api.qa.vault.tryvault.com/corporation-number";

/** Canadian (NANP) number: "+1", then a 10-digit number whose area code and exchange start with 2-9. */
const CANADIAN_PHONE_REGEX = /^\+1[2-9]\d{2}[2-9]\d{6}$/;
export const CORPORATION_NUMBER_LENGTH = 9;
export const NAME_MAX_LENGTH = 50;

async function isCorporationNumberValid(number: string): Promise<boolean> {
  try {
    const response = await fetch(
      `${CORPORATION_NUMBER_URL}/${encodeURIComponent(number)}`,
    );
    if (!response.ok) return false;
    const data: { valid?: boolean } = await response.json();
    return data.valid === true;
  } catch {
    return false;
  }
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

export const onboardingFormSchema = z.object({
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(
      CANADIAN_PHONE_REGEX,
      "Enter a valid Canadian phone number starting with +1",
    ),
  corporationNumber: z
    .string()
    .trim()
    .min(1, "Corporation number is required")
    .length(
      CORPORATION_NUMBER_LENGTH,
      `Corporation number must be ${CORPORATION_NUMBER_LENGTH} characters`,
    )
    .refine(isCorporationNumberValid, "Invalid corporation number"),
});

export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
