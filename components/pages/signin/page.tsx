import Image from "next/image";
import Link from "next/link";
import { SignInForm } from "./form";

export function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="flex justify-center">
          <Image
            src="./logo.svg"
            alt="LegalMarketplace"
            width={48}
            height={48}
            priority
          />
        </div>
        <h2 className="mt-4 text-center text-xl font-bold">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm">
          Or{" "}
          <Link
            href="/signup/client"
            className="font-medium underline text-primary"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}
