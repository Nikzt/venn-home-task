"use client";

import { useForm } from "react-hook-form";
import {
  CORPORATION_NUMBER_LENGTH,
  NAME_MAX_LENGTH,
  type OnboardingFormValues,
} from "@/lib/schemas/onboarding";
import { useSubmitOnboarding } from "@/queries/onboarding";
import FormSubmitButton from "../common/form-submit-button";
import FormTextField from "../common/form-text-field";
import { FieldSet } from "../ui/field";
import { useOnboardingResolver } from "./use-onboarding-resolver";

const PHONE_PLACEHOLDER = "+1";

export default function OnboardingForm() {
  const form = useForm<OnboardingFormValues>({
    resolver: useOnboardingResolver(),
    mode: "onBlur",
    reValidateMode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      corporationNumber: "",
    },
  });

  const submitOnboarding = useSubmitOnboarding();

  async function onSubmit(values: OnboardingFormValues) {
    return submitOnboarding.mutateAsync(values).catch(() => {
      // Error is surfaced via submitOnboarding.error below.
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <FieldSet>
        <div className="flex md:flex-row flex-col gap-4">
          <FormTextField
            name="firstName"
            control={form.control}
            label="First Name"
            inputProps={{ maxLength: NAME_MAX_LENGTH }}
          />
          <FormTextField
            name="lastName"
            control={form.control}
            label="Last Name"
            inputProps={{ maxLength: NAME_MAX_LENGTH }}
          />
        </div>
        <FormTextField
          name="phone"
          control={form.control}
          id="phoneNumber"
          label="Phone Number"
          showValidationResult
          inputProps={(field) => ({
            type: "tel",
            placeholder: PHONE_PLACEHOLDER,
            onFocus: () => {
              if (field.value === "") field.onChange(PHONE_PLACEHOLDER);
            },
          })}
        />
        <FormTextField
          name="corporationNumber"
          control={form.control}
          id="corpNumber"
          label="Corporation Number"
          showValidationResult
          inputProps={{
            inputMode: "numeric",
            maxLength: CORPORATION_NUMBER_LENGTH,
          }}
        />
        {submitOnboarding.isError && (
          <p role="alert" className="text-destructive text-sm">
            {submitOnboarding.error.message}
          </p>
        )}
        <FormSubmitButton
          isValidating={form.formState.isValidating}
          isSubmitting={form.formState.isSubmitting}
          isPending={submitOnboarding.isPending}
          isSuccess={submitOnboarding.isSuccess}
        />
      </FieldSet>
    </form>
  );
}
