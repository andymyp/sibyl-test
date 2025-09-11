"use client";

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
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  DollarSign,
  Clock,
  User,
  Mail,
  Shield,
  CheckCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@/components/providers/user-provider";
import { useGetLawyerCase } from "@/hooks/case/use-get-lawyer-case";
import { useState } from "react";
import { downloadFile } from "@/lib/utils";

interface Props {
  id: string;
}

export function LawyerCaseDetailPage({ id }: Props) {
  const user = useUser();

  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const { isGettingCase, case_ } = useGetLawyerCase(user.id, id);

  if (isGettingCase) {
    return (
      <Card className="flex-1">
        <CardContent className="flex flex-col flex-1 justify-center items-center">
          <Loader2 className="animate-spin !size-10 text-primary" />
        </CardContent>
      </Card>
    );
  }

  const acceptedQuote = case_?.quotes.find(
    (q) => q.caseId === id && q.lawyerId === user.id && q.status === "ACCEPTED"
  );

  if (!case_ || !acceptedQuote) {
    return (
      <Card className="flex-1">
        <CardContent className="flex flex-col flex-1 justify-center items-center">
          <Alert className="border-red-200 bg-red-50 w-fit">
            <AlertDescription className="text-destructive">
              Case not found or you don&apos;t have access to view this case.
              Only lawyers with accepted quotes can access case details.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link href="/lawyer/my-quotes">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to My Quotes
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const client = case_.client;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENGAGED":
        return "bg-green-100 text-green-800";
      case "CLOSED":
        return "bg-gray-100 text-gray-800";
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

  const handleSecureDownload = async (storageKey: string, fileName: string) => {
    setIsDownloading(fileName);

    try {
      await downloadFile(storageKey, fileName);
    } catch {
      toast.error("Download failed. Please try again");
    } finally {
      setIsDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col flex-1 w-full gap-4">
        <div className="flex items-center justify-between">
          <Link
            href="/lawyer/my-quotes"
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Quotes
          </Link>

          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Secure Access Granted
            </span>
          </div>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-green-700">
            <strong>Confidential Case Access:</strong> Your quote has been
            accepted and payment confirmed. You now have secure access to all
            case details, client information, and documents. Please maintain
            client confidentiality at all times.
          </AlertDescription>
        </Alert>

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
                        Created {formatDate(case_.createdAt)}
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
                      Case Description
                    </h4>
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {case_.description}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Case ID:</span>
                      <span className="ml-2 font-mono">{case_.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="ml-2">
                        {formatDate(case_.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-purple-600" />
                  Client Information
                </CardTitle>
                <CardDescription>
                  Confidential client details - handle with care
                </CardDescription>
              </CardHeader>
              <CardContent>
                {client ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium">{client.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Email Address
                            </p>
                            <p className="font-medium">{client.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Client Since
                            </p>
                            <p className="font-medium">
                              {formatDate(client.createdAt)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Shield className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Client ID</p>
                            <p className="font-medium font-mono">{client.id}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-800">
                        <strong>Confidentiality Notice:</strong> This client
                        information is provided under attorney-client privilege.
                        Do not share or discuss with unauthorized parties.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">
                    Client information not available
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-orange-600" />
                  Case Documents ({case_.files.length})
                </CardTitle>
                <CardDescription>
                  Secure document access with download tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                {case_.files.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No documents uploaded for this case
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {case_.files.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {file.mimeType === "application/pdf" ? (
                            <FileText className="h-6 w-6 text-red-500" />
                          ) : (
                            <ImageIcon className="h-6 w-6 text-indigo-500" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {file.filename}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>•</span>
                              <span>Uploaded {formatDate(file.createdAt)}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {file.mimeType.split("/")[1]} file
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            handleSecureDownload(file.storageKey, file.filename)
                          }
                          disabled={isDownloading === file.id}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          {isDownloading === file.id ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    ))}

                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 mt-4">
                      <p className="text-sm text-orange-800">
                        <strong>Document Security:</strong> All downloads are
                        logged and tracked. Documents are provided through
                        secure, time-limited access URLs.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">
                  Your Accepted Quote
                </CardTitle>
                <CardDescription className="text-green-700">
                  Payment confirmed and case engaged
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Quote Amount</span>
                  </div>
                  <span className="text-lg font-bold text-green-800">
                    ${(acceptedQuote.amount / 100).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">Timeline</span>
                  </div>
                  <span className="font-medium text-green-800">
                    {acceptedQuote.expectedDays} days
                  </span>
                </div>

                <Separator className="bg-green-200" />

                <div className="space-y-2">
                  <p className="text-sm text-green-700 font-medium">
                    Your Approach:
                  </p>
                  <p className="text-sm text-green-800 bg-white p-3 rounded border border-green-200">
                    {acceptedQuote.note}
                  </p>
                </div>

                <div className="text-xs text-green-600 space-y-1">
                  <div>Submitted: {formatDate(acceptedQuote.createdAt)}</div>
                  <div>Accepted: {formatDate(acceptedQuote.updatedAt)}</div>
                  <div>Quote ID: {acceptedQuote.id}</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Case Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Quote Accepted</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(acceptedQuote.updatedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Payment Confirmed</p>
                      <p className="text-xs text-gray-500">Access granted</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Case In Progress</p>
                      <p className="text-xs text-gray-500">Work commenced</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <div>
                      <p className="text-sm text-gray-500">Case Completion</p>
                      <p className="text-xs text-gray-400">Pending</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Client
                </Button>

                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>

                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>

                <Separator />

                <div className="text-xs text-gray-500 space-y-1">
                  <p>Need help? Contact support</p>
                  <p>Case management guidelines</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
