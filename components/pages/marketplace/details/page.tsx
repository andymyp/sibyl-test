"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Calendar, FileText, Loader2 } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { useGetCase } from "@/hooks/case/use-get-case";
import { IQuoteWithLawyer } from "@/lib/types/case-type";
import { Quote } from "@/lib/generated/prisma";
import { anonymizeText } from "@/lib/utils";
import { QuoteForm } from "./form";

interface Props {
  id: string;
}

export default function CaseQuotePage({ id }: Props) {
  const user = useUser();

  const { isGettingCase, case: case_ } = useGetCase(id);

  if (isGettingCase) {
    return (
      <Card className="flex-1">
        <CardContent className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="animate-spin !size-10 text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!case_) {
    return (
      <Card className="flex-1">
        <CardContent className="flex flex-col flex-1 justify-center items-center">
          <Alert className="border-red-200 bg-red-50 w-fit">
            <AlertDescription className="text-destructive">
              Case not found or you don't have permission to view it.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const existingQuote: IQuoteWithLawyer = case_.quotes.find(
    (q: Quote) => q.caseId === id && q.lawyerId === user.id
  );

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col w-full gap-4">
        <Link
          href="/lawyer/marketplace"
          className="inline-flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-indigo-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{case_.title}</CardTitle>
                    <CardDescription className="mt-2 flex items-center space-x-4">
                      <Badge variant="secondary">{case_.category}</Badge>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <FileText className="h-4 w-4 mr-1" />
                        {case_.files.length} files
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-800">
                    Open for Quotes
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Case Description
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {anonymizeText(case_.description)}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Client details and files will be
                      accessible only after your quote is accepted and payment
                      is processed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader>
                <CardTitle className="text-xl">
                  {existingQuote ? "Update Your Quote" : "Submit Your Quote"}
                </CardTitle>
                <CardDescription>
                  Provide your pricing and timeline for this legal matter
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuoteForm
                  user={user}
                  case_={case_}
                  existingQuote={existingQuote}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {existingQuote && (
              <Card className="border-indigo-200 bg-indigo-50">
                <CardHeader>
                  <CardTitle className="text-lg text-indigo-800">
                    Your Current Quote
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-indigo-700">Amount</span>
                    <span className="text-sm font-medium text-indigo-800">
                      ${existingQuote.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-indigo-700">Timeline</span>
                    <span className="text-sm font-medium text-indigo-800">
                      {existingQuote.expectedDays} days
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-indigo-700">Status</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {existingQuote.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-indigo-700">Submitted</span>
                    <span className="text-sm text-indigo-800">
                      {new Date(existingQuote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <span className="text-sm font-medium">{case_.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Files</span>
                  <span className="text-sm font-medium">
                    {case_.files.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Posted</span>
                  <span className="text-sm">
                    {new Date(case_.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Case ID</span>
                  <span className="text-sm font-mono">{case_.id}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Quote Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <span>Be competitive but fair in your pricing</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <span>
                    Provide realistic timelines based on case complexity
                  </span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <span>Highlight your relevant experience and approach</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2"></div>
                  <span>
                    You can update your quote until the case is engaged
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
