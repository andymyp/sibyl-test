"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Clock, FileText, ExternalLink } from "lucide-react";
import { useUser } from "@/components/providers/user-provider";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useGetMyQuotes } from "@/hooks/quote/use-get-my-quotes";
import { PageHeader } from "@/components/ui/page-header";
import { MyQuotesTable } from "./table";
import { useGetStatsQuotes } from "@/hooks/quote/use-get-stats-quotes";

export default function MyQuotesPage() {
  const user = useUser();

  const [filters, setFilters] = useQueryStates(
    {
      status: parseAsString.withDefault("all"),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    {
      history: "push",
    }
  );

  const stats = useGetStatsQuotes(user.id);

  const { isGettingQuotes, totalQuotes, quotes } = useGetMyQuotes(user.id, {
    ...filters,
    status: filters.status === "all" ? null : filters.status,
  });

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      <PageHeader
        title="My Quotes"
        description="Track your submitted quotes and access accepted case details"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">Total Quotes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.proposed}
                </p>
                <p className="text-sm text-gray-600">Proposed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.accepted}
                </p>
                <p className="text-sm text-gray-600">Accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExternalLink className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {stats.rejected}
                </p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Select
        value={filters.status}
        onValueChange={(value) => {
          setFilters({
            ...filters,
            status: value,
            page: 1,
          });
        }}
      >
        <SelectTrigger className="w-full max-w-xs bg-background">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="PROPOSED">Proposed</SelectItem>
          <SelectItem value="ACCEPTED">Accepted</SelectItem>
          <SelectItem value="REJECTED">Rejected</SelectItem>
        </SelectContent>
      </Select>

      <MyQuotesTable
        isLoading={isGettingQuotes}
        total={totalQuotes}
        data={quotes}
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
}
