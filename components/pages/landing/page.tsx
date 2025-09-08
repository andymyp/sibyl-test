import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  DollarSign,
  FileText,
  Scale,
  Shield,
  Users,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen w-full">
      <nav className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Image
              src="./logo.svg"
              alt="LegalMarketplace"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-bold text-gray-900">LegalMarket</span>
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/signup/client"
              className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Connect with Legal
            <span className="text-primary"> Professionals</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A secure marketplace where clients can find qualified lawyers for
            their legal needs. Post your case, receive competitive quotes, and
            work with the right legal professional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup/client"
              className="bg-primary text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              I Need Legal Help
            </Link>
            <Link
              href="/signup/lawyer"
              className="border border-primary text-primary hover:bg-blue-50 px-8 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              I'm a Lawyer
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple, secure, and transparent legal services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Post Your Case
              </h3>
              <p className="text-gray-600">
                Describe your legal needs and upload relevant documents
                securely.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Receive Quotes
              </h3>
              <p className="text-gray-600">
                Qualified lawyers review your case and provide competitive
                quotes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                Choose your preferred lawyer and make secure payments through
                our platform.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Privacy Protected
              </h3>
              <p className="text-gray-600">
                Your case details remain anonymous until you engage a lawyer.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Turnaround
              </h3>
              <p className="text-gray-600">
                Get responses from lawyers quickly with clear timelines.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Scale className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quality Lawyers
              </h3>
              <p className="text-gray-600">
                Work with verified legal professionals with proper credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image
              src="./logo.svg"
              alt="LegalMarketplace"
              width={24}
              height={24}
              priority
            />
            <span className="text-lg font-bold">LegalMarket</span>
          </div>
          <p className="text-gray-400">
            Secure legal marketplace connecting clients with qualified
            professionals
          </p>
        </div>
      </footer>
    </div>
  );
}
