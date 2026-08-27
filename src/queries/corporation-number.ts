import { queryOptions, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

const CORPORATION_NUMBER_URL =
  "https://fe-hometask-api.qa.vault.tryvault.com/corporation-number";

export type CorporationNumberResult =
  | { valid: true; corporationNumber: string }
  | { valid: false; message: string };

/** Thrown when the validation endpoint is unreachable or returns an unexpected response. */
export class CorporationNumberLookupError extends Error {
  constructor(message = "Could not verify corporation number") {
    super(message);
    this.name = "CorporationNumberLookupError";
  }
}

export async function fetchCorporationNumber(
  number: string,
): Promise<CorporationNumberResult> {
  const response = await fetch(
    `${CORPORATION_NUMBER_URL}/${encodeURIComponent(number)}`,
  );
  if (!response.ok) throw new CorporationNumberLookupError();

  const data: Partial<CorporationNumberResult> = await response.json();
  if (data.valid === true) {
    return { valid: true, corporationNumber: number };
  }
  if (data.valid === false) {
    return {
      valid: false,
      message: data.message ?? "Invalid corporation number",
    };
  }
  throw new CorporationNumberLookupError();
}

export const corporationNumberQueryOptions = (number: string) =>
  queryOptions({
    queryKey: ["corporation-number", number] as const,
    queryFn: () => fetchCorporationNumber(number),
    // A corporation number's validity doesn't change while the form is open,
    // so cache it for the session and dedupe concurrent lookups.
    staleTime: Number.POSITIVE_INFINITY,
    retry: 1,
  });

/**
 * Returns an imperative validator backed by the React Query cache, suitable
 * for on-blur/on-submit validation: repeated checks of the same number are
 * served from cache instead of hitting the API again.
 */
export function useCorporationNumberValidator() {
  const queryClient = useQueryClient();
  return useCallback(
    (number: string) =>
      queryClient.ensureQueryData(corporationNumberQueryOptions(number)),
    [queryClient],
  );
}
