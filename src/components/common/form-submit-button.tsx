import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type FormSubmitButtonProps = {
  /** Form-level validation/submission is in progress. */
  isSubmitting: boolean;
  /** The submit request is in flight. */
  isPending: boolean;
  /** The submit request succeeded. */
  isSuccess: boolean;
};

export default function FormSubmitButton({
  isSubmitting,
  isPending,
  isSuccess,
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      className={cn(
        "w-full",
        isSuccess &&
          "bg-transparent text-muted-foreground transition-colors hover:bg-transparent",
      )}
      disabled={isSubmitting || isPending || isSuccess}
    >
      {isSuccess ? (
        <>
          Success
          <CheckCircle2 />
        </>
      ) : (
        <>
          Submit{" "}
          {isSubmitting ? <Loader2 className="animate-spin" /> : <ArrowRight />}
        </>
      )}
    </Button>
  );
}
