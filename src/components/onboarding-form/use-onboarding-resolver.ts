import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { Resolver } from "react-hook-form";
import {
  type OnboardingFormValues,
  onboardingFormSchema,
} from "@/lib/schemas/onboarding";
import {
  type CorporationNumberResult,
  useCorporationNumberValidator,
} from "@/queries/corporation-number";

const CORPORATION_NUMBER_LOOKUP_ERROR_MESSAGE =
  "Could not verify corporation number. Please try again.";

export type CorporationNumberValidator = (
  number: string,
) => Promise<CorporationNumberResult>;

/**
 * Wraps the pure `onboardingFormSchema` resolver with the async corporation
 * number lookup. The lookup only runs once the sync rules for the field pass,
 * so malformed input never hits the API.
 */
export function createOnboardingResolver(
  validateCorporationNumber: CorporationNumberValidator,
): Resolver<OnboardingFormValues> {
  const base = zodResolver(onboardingFormSchema);
  return async (values, context, options) => {
    const result = await base(values, context, options);
    if (result.errors.corporationNumber) return result;

    const message = await lookupErrorMessage(
      validateCorporationNumber,
      values.corporationNumber,
    );
    if (!message) return result;

    return {
      values: {},
      errors: {
        ...result.errors,
        corporationNumber: { type: "validate", message },
      },
    };
  };
}

async function lookupErrorMessage(
  validateCorporationNumber: CorporationNumberValidator,
  number: string,
): Promise<string | undefined> {
  try {
    const result = await validateCorporationNumber(number.trim());
    return result.valid ? undefined : result.message;
  } catch {
    return CORPORATION_NUMBER_LOOKUP_ERROR_MESSAGE;
  }
}

/** Resolver backed by the React Query-cached corporation number lookup. */
export function useOnboardingResolver() {
  const validateCorporationNumber = useCorporationNumberValidator();
  return useMemo(
    () => createOnboardingResolver(validateCorporationNumber),
    [validateCorporationNumber],
  );
}
