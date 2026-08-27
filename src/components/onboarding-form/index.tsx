import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldError,
} from "../ui/field";
import { Input } from "../ui/input";

export default function OnboardingForm() {
  return (
    <FieldSet>
      <FieldGroup className="flex flex-row gap-4">
        <Field>
          <FieldLabel htmlFor="firstName">First Name</FieldLabel>
          <Input id="firstName" autoComplete="off" placeholder="" />
        </Field>
        <Field>
          <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
          <Input id="lastName" autoComplete="off" placeholder="" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="phoneNumber">Phone Number</FieldLabel>
          <Input id="phoneNumber" autoComplete="off" placeholder="" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="corpNumber">Corporation Number</FieldLabel>
          <Input id="corpNumber" autoComplete="off" placeholder="" />
          <FieldError>Invalid Corporation Number</FieldError>
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
