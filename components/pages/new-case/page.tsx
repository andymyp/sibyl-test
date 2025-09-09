import { User } from "@supabase/supabase-js";
import { CaseForm } from "./form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  user: User;
}

export function NewCasePage({ user }: Props) {
  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-xl">Create New Case</CardTitle>
          <CardDescription>
            Describe your legal matter and upload relevant documents to receive
            quotes from qualified lawyers
          </CardDescription>
        </CardHeader>

        <CardContent>
          <CaseForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
