"use client";

import { CaseForm } from "./form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";

export function NewCasePage() {
  const user = useUser();

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col w-full max-w-2xl gap-4">
        <Link
          href="/client/dashboard"
          className="inline-flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Create New Case</CardTitle>
            <CardDescription>
              Describe your legal matter and upload relevant documents to
              receive quotes from qualified lawyers
            </CardDescription>
          </CardHeader>

          <CardContent>
            <CaseForm user={user} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
