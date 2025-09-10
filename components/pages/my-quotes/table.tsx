import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTable } from "@/components/ui/datatable";
import { useRouter } from "@bprogress/next";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Eye, MoreVertical } from "lucide-react";
import { IQuotesParams, IQuoteWithCase } from "@/lib/types/quote-type";
import { Badge } from "@/components/ui/badge";

const getStatusColor = (status: string) => {
  switch (status) {
    case "PROPOSED":
      return "bg-yellow-100 text-yellow-800";
    case "ACCEPTED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const columns: ColumnDef<IQuoteWithCase>[] = [
  {
    accessorKey: "case_.title",
    header: "Case Title",
    cell: (info) => (
      <div className="font-medium">{info.getValue<string>()}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "case_.category",
    header: "Category",
    cell: (info) => <div>{info.getValue<string>()}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: (info) => <div>${info.getValue<number>().toLocaleString()}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "expectedDays",
    header: "Expected",
    cell: (info) => <div>{info.getValue<number>()} days</div>,
    enableSorting: false,
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: (info) => (
      <div className="truncate line-clamp-1">{info.getValue<string>()}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <Badge className={getStatusColor(info.getValue<string>())}>
        {info.getValue<string>()}
      </Badge>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: "Quoted",
    cell: (info) => (
      <div>{new Date(info.getValue<string>()).toLocaleDateString()}</div>
    ),
    enableSorting: false,
  },
];

interface Props {
  filters: IQuotesParams | null;
  setFilters: (filters: IQuotesParams | null) => void;
  total: number;
  data: IQuoteWithCase[];
  isLoading?: boolean;
}

export function MyQuotesTable({
  filters,
  setFilters,
  total,
  data,
  isLoading,
}: Props) {
  const router = useRouter();

  const canAccessCaseFiles = (quote: IQuoteWithCase) => {
    const case_ = quote.case_;
    return quote.status === "ACCEPTED" && case_?.status === "ENGAGED";
  };

  const rowActions = (row: IQuoteWithCase) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canAccessCaseFiles(row) && (
            <DropdownMenuItem
              onClick={() => router.push(`/lawyer/case/${row.caseId}`)}
            >
              <Eye />
              View Full Case Details
            </DropdownMenuItem>
          )}
          {row.status === "PROPOSED" && row.case_.status === "OPEN" && (
            <DropdownMenuItem
              onClick={() => router.push(`/lawyer/marketplace/${row.caseId}`)}
            >
              <Edit2 />
              Update Quote
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  if (!filters) return null;

  return (
    <DataTable
      filters={filters}
      setFilters={setFilters}
      columns={columns}
      totalRows={total}
      data={data}
      rowActions={rowActions}
      isLoading={isLoading}
      striped
      stickyHeader
    />
  );
}
