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
import {
  Plus,
  FileText,
  Clock,
  DollarSign,
  Users,
  Search,
  Loader2,
} from "lucide-react";
import { User } from "@supabase/supabase-js";
import { PageHeader } from "@/components/ui/page-header";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetMyCases } from "@/hooks/case/use-get-my-cases";
import { Input } from "@/components/ui/input";
import { Paginator } from "@/components/ui/paginator";

interface Props {
  user: User;
}

export function DashboardPage({ user }: Props) {
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    {
      history: "push",
    }
  );

  const searchDebounce = useDebounce(filters.search, 300);

  const { isGettingCases, totalCases, cases } = useGetMyCases(user.id, {
    ...filters,
    search: searchDebounce,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
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

  const getQuoteCount = (caseId: string) => {
    const legalCase = cases.find((c) => c.id === caseId);
    return legalCase?.Quote?.length ?? 0;
  };

  const totals = cases.reduce(
    (acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      acc.totalQuotes += c.Quote?.length || 0;
      return acc;
    },
    { OPEN: 0, ENGAGED: 0, CLOSED: 0, CANCELLED: 0, totalQuotes: 0 }
  );

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      <PageHeader
        title={`Welcome back, ${user.user_metadata.name}`}
        description="Manage your legal cases and review quotes from qualified lawyers"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{totalCases}</p>
                <p className="text-sm text-gray-600">Total Cases</p>
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
                  {totals.OPEN}
                </p>
                <p className="text-sm text-gray-600">Open Cases</p>
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
                  {totals.ENGAGED}
                </p>
                <p className="text-sm text-gray-600">Engaged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {totals.totalQuotes}
                </p>
                <p className="text-sm text-gray-600">Total Quotes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col flex-1 gap-4 mt-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Cases</h2>
          <div className="flex gap-4">
            <Input
              className="bg-background w-full min-w-xs"
              placeholder="Search title or description"
              leftIcon={Search}
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                })
              }
            />
            <Link href="/client/cases/new">
              <Button>
                <Plus className="h-4 w-4" />
                Create New Case
              </Button>
            </Link>
          </div>
        </div>

        {isGettingCases ? (
          <Card className="flex-1">
            <CardContent className="flex flex-col flex-1 justify-center items-center">
              <Loader2 className="animate-spin !size-10 text-primary" />
            </CardContent>
          </Card>
        ) : cases.length === 0 ? (
          <Card className="flex-1">
            <CardContent className="flex flex-col flex-1 justify-center items-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No cases yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first case to start receiving quotes from qualified
                lawyers
              </p>
              <Link href="/client/cases/new">
                <Button>
                  <Plus className="h-4 w-4" />
                  Create Your First Case
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cases.map((case_) => (
              <Card
                key={case_.id}
                className="hover:shadow-md transition-shadow gap-4"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{case_.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {case_.category} • Created{" "}
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(case_.status)}>
                      {case_.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {case_.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{case_.CaseFile.length} files</span>
                      <span>{getQuoteCount(case_.id)} quotes</span>
                    </div>
                    <Link href={`/client/cases/${case_.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Paginator
          count={totalCases}
          setPage={(page) => {
            setFilters({
              ...filters,
              page,
            });
          }}
          setLimit={(limit) => {
            setFilters({
              ...filters,
              limit,
            });
          }}
          page={filters.page}
          limit={filters.limit}
          rowPerPage={[10, 20, 50, 100]}
        />
      </div>
    </div>
  );
}
