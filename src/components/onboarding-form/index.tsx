"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  CORPORATION_NUMBER_LENGTH,
  NAME_MAX_LENGTH,
  type OnboardingFormValues,
  onboardingFormSchema,
} from "@/lib/schemas/onboarding";
import { cn } from "@/lib/utils";
import { useSubmitOnboarding } from "@/queries/onboarding";
import { Button } from "../ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "../ui/field";
import { Input } from "../ui/input";

export default function OnboardingForm() {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
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

  function onSubmit(values: OnboardingFormValues) {
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
                  placeholder="+1"
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
              </Field>
            )}
          />
        </FieldGroup>
        {submitOnboarding.isError && (
          <p role="alert" className="text-destructive text-sm">
            {submitOnboarding.error.message}
          </p>
        )}
        <Button
          type="submit"
          className={cn(
            "w-full",
            submitOnboarding.isSuccess &&
              "bg-transparent text-muted-foreground transition-colors hover:bg-transparent",
          )}
          disabled={
            form.formState.isSubmitting ||
            submitOnboarding.isPending ||
            submitOnboarding.isSuccess
          }
        >
          {submitOnboarding.isSuccess ? (
            <>
              Success
              <CheckCircle2 className="" />
            </>
          ) : (
            <>
              Submit{" "}
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowRight />
              )}
            </>
          )}
        </Button>
      </FieldSet>
    </form>
  );
}
