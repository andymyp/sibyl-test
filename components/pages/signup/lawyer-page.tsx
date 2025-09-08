import Image from "next/image";
import Link from "next/link";
import { SignUpLawyerForm } from "./lawyer-form";

export function SignUpLawyerPage() {
  return (
    <div className="min-h-screen w-full sm:max-w-md flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Image
            src="/logo.svg"
            alt="LegalMarketplace"
            width={48}
            height={48}
            priority
          />
        </div>
        <h2 className="mt-4 text-center text-xl font-bold">
          Create lawyer account
        </h2>
        <p className="mt-2 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline text-primary">
            Sign In
          </Link>
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignUpLawyerForm />
        </div>
        <div className="mt-6 text-center text-sm">
          Need legal help?{" "}
          <Link
            href="/signup/lawyer"
            className="font-medium underline text-primary"
          >
            Sign Up as a client
          </Link>
        </div>
      </div>
    </div>
  );
}
