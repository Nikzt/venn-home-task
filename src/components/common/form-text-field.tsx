import type { ComponentProps } from "react";
import {
  Controller,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldValidationResult,
} from "../ui/field";
import { Input } from "../ui/input";

type InputProps = Omit<
  ComponentProps<typeof Input>,
  "id" | "name" | "value" | "onChange" | "onBlur" | "aria-invalid"
>;

type FormTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = Pick<UseControllerProps<TFieldValues, TName>, "name" | "control"> & {
  label: string;
  /** DOM id for the input; defaults to `name`. */
  id?: string;
  /** Show the loading / success indicator for async validation. */
  showValidationResult?: boolean;
  /**
   * Extra props forwarded to the input. Pass a function to derive props from
   * the controller's field state (e.g. to react to the current value).
   */
  inputProps?:
    | InputProps
    | ((field: ControllerRenderProps<TFieldValues, TName>) => InputProps);
};

export default function FormTextField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  id = name,
  showValidationResult = false,
  inputProps,
}: FormTextFieldProps<TFieldValues, TName>) {
  return (
    <FieldGroup>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
              autoComplete="off"
              {...(typeof inputProps === "function"
                ? inputProps(field)
                : inputProps)}
              {...field}
              id={id}
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            {showValidationResult && (
              <FieldValidationResult
                isLoading={fieldState.isValidating}
                isValid={fieldState.isTouched && !fieldState.invalid}
              />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
