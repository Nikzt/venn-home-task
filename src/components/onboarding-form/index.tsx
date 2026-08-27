"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  CORPORATION_NUMBER_LENGTH,
  createOnboardingFormSchema,
  NAME_MAX_LENGTH,
  type OnboardingFormValues,
} from "@/lib/schemas/onboarding";
import { useCorporationNumberValidator } from "@/queries/corporation-number";
import { useSubmitOnboarding } from "@/queries/onboarding";
import FormSubmitButton from "../common/form-submit-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldValidationResult,
} from "../ui/field";
import { Input } from "../ui/input";

const PHONE_PLACEHOLDER = "+1";

export default function OnboardingForm() {
  const validateCorporationNumber = useCorporationNumberValidator();
  const schema = useMemo(
    () => createOnboardingFormSchema({ validateCorporationNumber }),
    [validateCorporationNumber],
  );

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(schema),
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
          <FieldGroup>
            <Controller
              name="firstName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    {...field}
                    id="firstName"
                    autoComplete="off"
                    maxLength={NAME_MAX_LENGTH}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="lastName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    {...field}
                    id="lastName"
                    autoComplete="off"
                    maxLength={NAME_MAX_LENGTH}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </div>
        <FieldGroup>
          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
                <Input
                  {...field}
                  id="phoneNumber"
                  type="tel"
                  autoComplete="off"
                  placeholder={PHONE_PLACEHOLDER}
                  aria-invalid={fieldState.invalid}
                  onFocus={() => {
                    if (field.value === "") field.onChange(PHONE_PLACEHOLDER);
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldValidationResult
                  isLoading={fieldState.isValidating}
                  isValid={fieldState.isTouched && !fieldState.invalid}
                />
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Controller
            name="corporationNumber"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="corpNumber">Corporation Number</FieldLabel>
                <Input
                  {...field}
                  id="corpNumber"
                  autoComplete="off"
                  inputMode="numeric"
                  maxLength={CORPORATION_NUMBER_LENGTH}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                <FieldValidationResult
                  isLoading={fieldState.isValidating}
                  isValid={fieldState.isTouched && !fieldState.invalid}
                />
              </Field>
            )}
          />
        </FieldGroup>
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
