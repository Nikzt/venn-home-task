import FormContainer from "@/components/common/form-container";
import OnboardingForm from "@/components/onboarding-form";

export default function Home() {
  return (
    <FormContainer
      title="Onboarding Form"
      FormNav={() => (
        <div className="text-muted-foreground mt-10 text-center">
          Step 1 of 5
        </div>
      )}
    >
      <OnboardingForm />
    </FormContainer>
  );
}
