import { Card, CardContent, CardTitle } from "../ui/card";

/**
 * Full page layout for form submission
 */
export default function FormContainer({
  children,
  title,
  FormNav,
}: {
  children: React.ReactNode;
  title: string;
  FormNav: React.FC;
}) {
  return (
    <div className="px-4">
      <FormNav />
      <Card className="max-w-132 mt-10 md:mt-[10vh] mx-auto">
        <CardTitle className="text-2xl text-center mb-2">{title}</CardTitle>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
