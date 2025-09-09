import Image from "next/image";
import Link from "next/link";
import { SignUpClientForm } from "./client-form";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignUpClientPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Landing
        </Link>

        <Card className="border-indigo-100 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Image
                src="/logo.svg"
                alt="LegalConnect"
                width={48}
                height={48}
                priority
              />
            </div>
            <div>
              <CardTitle className="text-2xl">Create Client Account</CardTitle>
              <CardDescription>
                Post your legal cases and connect with qualified lawyers
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <SignUpClientForm />

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                Are you a lawyer?{" "}
                <Link
                  href="/signup/lawyer"
                  className="text-primary hover:text-primary/80 font-medium"
                >
                  Create lawyer account
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
