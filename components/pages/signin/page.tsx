import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "./form";
import { ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SignInPage() {
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
                src="./logo.svg"
                alt="LegalConnect"
                width={48}
                height={48}
                priority
              />
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your LegalConnect account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <SignInForm />

            <div className="mt-6 text-center space-y-4">
              <div className="text-sm text-gray-600">
                Don't have an account?
              </div>
              <div className="flex space-x-2">
                <Link href="/signup/client" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign up as Client
                  </Button>
                </Link>
                <Link href="/signup/lawyer" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Sign up as Lawyer
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 p-3 bg-indigo-50 rounded-lg">
              <p className="text-xs text-muted-foreground font-medium mb-2">
                Demo Accounts:
              </p>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Client: client1@mail.com / 123123</div>
                <div>Lawyer: lawyer1@mail.com / 123123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
