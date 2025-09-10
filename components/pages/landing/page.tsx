import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, FileText, Shield, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LandingPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50">
      <nav className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image
                src="./logo.svg"
                alt="LegalConnect"
                width={32}
                height={32}
                priority
              />
              <span className="text-xl font-bold text-primary">
                LegalConnect
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Connect with <span className="text-primary">Legal Experts</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A secure marketplace where clients find qualified lawyers and
            lawyers discover new cases. Professional legal services, simplified.
          </p>

          <div className="flex justify-center space-x-4 mb-16">
            <Link href="/signup/client">
              <Button size="lg" className="px-8">
                I need legal help
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signup/lawyer">
              <Button size="lg" variant="outline" className="px-8">
                I'm a lawyer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>For Clients</CardTitle>
                <CardDescription>
                  Post your legal case and receive competitive quotes from
                  qualified lawyers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Secure case posting
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Multiple quotes comparison
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Secure payment processing
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>For Lawyers</CardTitle>
                <CardDescription>
                  Browse anonymized cases and submit competitive quotes for new
                  clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Anonymous case browsing
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Flexible quote submission
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Secure client communication
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Secure & Trusted</CardTitle>
                <CardDescription>
                  Enterprise-grade security with verified lawyer credentials and
                  encrypted communication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Lawyer verification
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Encrypted file sharing
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Secure payments</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 LegalConnect. Professional legal marketplace.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
