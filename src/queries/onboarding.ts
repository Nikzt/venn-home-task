import { useMutation } from "@tanstack/react-query";
import type { OnboardingFormValues } from "@/lib/schemas/onboarding";

const PROFILE_DETAILS_URL =
  "https://fe-hometask-api.qa.vault.tryvault.com/profile-details";

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

/** Error raised when the profile-details API rejects a submission (e.g. 400 with a message). */
export class OnboardingSubmissionError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "OnboardingSubmissionError";
  }
}

export async function submitOnboarding(
  values: OnboardingFormValues,
): Promise<void> {
  const response = await fetch(PROFILE_DETAILS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (response.ok) return;

  let message = DEFAULT_ERROR_MESSAGE;
  try {
    const data: { message?: string } = await response.json();
    if (data.message) message = data.message;
  } catch {
    // Non-JSON error body; fall back to the default message.
  }
  throw new OnboardingSubmissionError(message, response.status);
}

export function useSubmitOnboarding() {
  return useMutation<void, OnboardingSubmissionError, OnboardingFormValues>({
    mutationFn: submitOnboarding,
  });
}
