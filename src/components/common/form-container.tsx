import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "../ui/card";

export default function FormContainer({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="px-4">
      <div className="text-muted-foreground mt-10 text-center">Step 1 of 5</div>
      <Card className="max-w-132 mt-[10vh] mx-auto">
        <CardTitle className="text-2xl text-center">{title}</CardTitle>
        <CardContent>{children}</CardContent>
        <CardFooter>
          <Button className="w-full flex items-center gap-2">
            Submit
            <ArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
