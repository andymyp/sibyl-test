"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Download,
  FileText,
  Image,
  Calendar,
  DollarSign,
  Clock,
  UserIcon,
  CreditCard,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { useGetMyCase } from "@/hooks/case/use-get-my-case";
import { CaseFile } from "@/lib/generated/prisma";
import { IQuoteWithLawyer } from "@/lib/types/case-type";
import { downloadFile } from "@/lib/utils";
import { useUser } from "@/components/providers/user-provider";

interface Props {
  id: string;
}

export function MyCasePage({ id }: Props) {
  const user = useUser();

  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const { isGettingCase, case: case_ } = useGetMyCase(user.id, id);

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

  const quotes: IQuoteWithLawyer[] = case_.quotes ?? [];
  const acceptedQuote = quotes.find((q) => q.status === "ACCEPTED");

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-indigo-100 text-indigo-800";
      case "engaged":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getQuoteStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "proposed":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleAcceptQuote = async (quote: IQuoteWithLawyer) => {
    setIsProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: call supabase update
      // await supabase.from("Quote").update({ status: "ACCEPTED" }).eq("id", quote.id)
      // await supabase.from("LegalCase").update({ status: "ENGAGED", engagedQuoteId: quote.id }).eq("id", case_.id)

      toast.success(
        "Payment processed successfully! The lawyer can now access your case details."
      );
      setIsPaymentOpen(false);
      setSelectedQuote(null);
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col w-full gap-4">
        <Link
          href="/client/dashboard"
          className="inline-flex items-center text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-indigo-100">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{case_.title}</CardTitle>
                    <CardDescription className="mt-2 flex items-center space-x-4">
                      <span>{case_.category}</span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(case_.status)}>
                    {case_.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Description
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap">
                      {case_.description}
                    </p>
                  </div>

                  {case_.files.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">
                        Documents ({case_.files.length})
                      </h4>
                      <div className="space-y-2">
                        {case_.files.map((file: CaseFile) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              {file.mimeType === "application/pdf" ? (
                                <FileText className="h-5 w-5 text-red-500" />
                              ) : (
                                <Image className="h-5 w-5 text-indigo-500" />
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {file.filename}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(file.size)}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                downloadFile(file.storageKey, file.filename)
                              }
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quotes Received ({quotes.length})</CardTitle>
                <CardDescription>
                  Review and compare quotes from qualified lawyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quotes.length === 0 ? (
                  <div className="text-center py-8">
                    <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No quotes received yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.map((quote) => (
                      <Card key={quote.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {quote.lawyer?.name ?? "Unknown Lawyer"}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Submitted{" "}
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              className={getQuoteStatusColor(quote.status)}
                            >
                              {quote.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-lg font-semibold text-gray-900">
                                $
                                {Math.round(
                                  quote.amountCents / 100
                                ).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-indigo-600" />
                              <span className="text-gray-700">
                                {quote.expectedDays} days
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{quote.note}</p>

                          {case_.status === "OPEN" &&
                            quote.status === "PROPOSED" && (
                              <Dialog
                                open={
                                  isPaymentOpen && selectedQuote === quote.id
                                }
                                onOpenChange={(open) => {
                                  setIsPaymentOpen(open);
                                  if (!open) setSelectedQuote(null);
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    onClick={() => setSelectedQuote(quote.id)}
                                    className="w-full"
                                  >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Accept & Pay $
                                    {Math.round(
                                      quote.amountCents / 100
                                    ).toLocaleString()}
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Accept Quote & Pay
                                    </DialogTitle>
                                    <DialogDescription>
                                      You are about to accept the quote from{" "}
                                      {quote.lawyer?.name ?? "Unknown Lawyer"}{" "}
                                      and pay $
                                      {Math.round(
                                        quote.amountCents / 100
                                      ).toLocaleString()}
                                      .
                                    </DialogDescription>
                                  </DialogHeader>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setIsPaymentOpen(false);
                                        setSelectedQuote(null);
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => handleAcceptQuote(quote)}
                                      disabled={isProcessingPayment}
                                    >
                                      {isProcessingPayment
                                        ? "Processing..."
                                        : "Pay Now"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}

                          {quote.status === "ACCEPTED" && (
                            <Alert className="border-green-200 bg-green-50">
                              <AlertDescription className="text-green-700">
                                ✓ Quote accepted and paid. The lawyer can now
                                access your case details.
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Case Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(case_.status)}>
                    {case_.status}
                  </Badge>
                </div>
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
                  <span className="text-sm text-gray-600">Quotes</span>
                  <span className="text-sm font-medium">{quotes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm">
                    {new Date(case_.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {case_.updatedAt !== case_.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Updated</span>
                    <span className="text-sm">
                      {new Date(case_.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {acceptedQuote && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800">
                    Accepted Quote
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Lawyer</span>
                    <span className="text-sm font-medium text-green-800">
                      {acceptedQuote.lawyer?.name ?? "Unknown Lawyer"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Amount</span>
                    <span className="text-sm font-medium text-green-800">
                      $
                      {Math.round(
                        acceptedQuote.amountCents / 100
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Timeline</span>
                    <span className="text-sm font-medium text-green-800">
                      {acceptedQuote.expectedDays} days
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
