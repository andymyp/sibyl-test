"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, Loader2, Search } from "lucide-react";
import { categories } from "@/lib/dummy-data";
import { PageHeader } from "@/components/ui/page-header";
import { anonymizeText } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import {
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  useQueryStates,
} from "nuqs";
import { User } from "@supabase/supabase-js";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetCases } from "@/hooks/case/use-get-cases";
import { Paginator } from "@/components/ui/paginator";
import { Quote } from "@/lib/generated/prisma";

interface Props {
  user: User;
}

export function MarketplacePage({ user }: Props) {
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      category: parseAsString.withDefault("all"),
      created_since: parseAsIsoDate,
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(10),
    },
    {
      history: "push",
    }
  );

  const searchDebounce = useDebounce(filters.search, 300);

  const { isGettingCases, totalCases, cases } = useGetCases({
    ...filters,
    search: searchDebounce,
  });

  const hasQuoteForCase = (caseId: string) => {
    return cases.some(
      (c) =>
        c.id === caseId &&
        c.quotes.some((quote: Quote) => quote.lawyerId === user.id)
    );
  };

  const clearFilters = () => {
    setFilters(null);
  };

  return (
    <div className="flex flex-col flex-1 w-full gap-4">
      <PageHeader
        title="Legal Case Marketplace"
        description="Browse available cases and submit competitive quotes to potential clients"
      />

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
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

            <Select
              value={filters.category}
              onValueChange={(value) => {
                setFilters({
                  ...filters,
                  category: value,
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <DatePicker
              value={filters.created_since}
              onChange={(value) => {
                setFilters({
                  ...filters,
                  created_since: value,
                });
              }}
            />

            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

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
              No cases found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your filters to see more cases
            </p>
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
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {case_.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </div>
                      <Badge variant="secondary">{case_.category}</Badge>
                    </div>
                  </div>
                  {hasQuoteForCase(case_.id) && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Quote Submitted
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {anonymizeText(case_.description)}
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-muted-foreground text-xs">
                    <FileText className="h-4 w-4 mr-1" />
                    {case_.files.length} files
                  </div>
                  <Link href={`/lawyer/marketplace/${case_.id}`}>
                    <Button variant="outline">View Details & Quote</Button>
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
  );
}
