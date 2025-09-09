"use client";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  Loader2,
} from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { usePagination } from "@/hooks/use-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "./pagination";
import { Button } from "./button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

interface TableFilters {
  page: number;
  limit: number;
  sort_by?: string | null;
  sort_order?: string | null;
}

export type DataTableProps<T> = {
  filters: TableFilters;
  setFilters: (filters: TableFilters) => void;
  columns: ColumnDef<T>[];
  totalRows: number;
  data: T[];
  pageSizes?: number[];
  striped?: boolean;
  stickyHeader?: boolean;
  className?: string;
  isLoading?: boolean;
  rowActions?: (row: T) => React.ReactNode;
  maxHeight?: string;
};

export function DataTable<T>({
  filters,
  setFilters,
  columns,
  totalRows = 0,
  data,
  pageSizes = [10, 25, 50, 100],
  rowActions,
  striped = true,
  stickyHeader = true,
  className,
  isLoading,
  maxHeight = "70vh",
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil(totalRows / filters.limit),
  });

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: filters.page,
    totalPages: table.getPageCount(),
    paginationItemsToDisplay: 5,
  });

  return (
    <div
      className={cn(
        "flex flex-col w-full gap-2.5",
        isLoading && "!pointer-events-none"
      )}
    >
      <div
        className={cn(
          "w-full overflow-x-auto overflow-y-auto rounded-md border",
          className
        )}
        style={{ maxHeight }}
      >
        <Table className="w-full min-w-max">
          <TableHeader
            className={cn(
              "rounded-t-md bg-primary",
              stickyHeader && "sticky top-0 z-20"
            )}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 px-4 text-white font-medium"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <button
                        className="flex h-10 w-full items-center justify-between gap-2 select-none"
                        onClick={() => {
                          const colId = header.column.id;
                          const isActive = filters.sort_by === colId;

                          if (!isActive) {
                            setFilters({
                              ...filters,
                              sort_by: colId,
                              sort_order: "ASC",
                            });
                          } else if (filters.sort_order === "ASC") {
                            setFilters({
                              ...filters,
                              sort_order: "DESC",
                            });
                          } else if (filters.sort_order === "DESC") {
                            setFilters({
                              ...filters,
                              sort_by: null,
                              sort_order: null,
                            });
                          }
                        }}
                      >
                        <span className="truncate">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {filters.sort_by === header.column.id ? (
                          filters.sort_order === "ASC" ? (
                            <ChevronUpIcon className="shrink-0" size={16} />
                          ) : filters.sort_order === "DESC" ? (
                            <ChevronDownIcon className="shrink-0" size={16} />
                          ) : null
                        ) : (
                          <ChevronsUpDownIcon
                            className="shrink-0 opacity-60"
                            size={16}
                          />
                        )}
                      </button>
                    ) : (
                      <span className="truncate">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </span>
                    )}
                  </TableHead>
                ))}
                {rowActions && (
                  <TableHead className="h-12 w-[48px] text-center text-white font-medium bg-primary"></TableHead>
                )}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="h-24 text-center"
                >
                  <Loader2 className="mx-auto animate-spin !size-8" />
                </TableCell>
              </TableRow>
            ) : data.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    striped &&
                      rowIndex % 2 === 1 &&
                      "bg-muted dark:bg-background",
                    "hover:!bg-primary/10 dark:hover:!bg-primary/5"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  {rowActions && (
                    <TableCell className="w-[48px] text-center">
                      {rowActions(row.original)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="h-24 text-center text-muted-foreground"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3 max-sm:flex-col">
        <p className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
          Page <span className="text-foreground">{filters.page}</span> of{" "}
          <span className="text-foreground">{table.getPageCount()}</span>
        </p>
        <div className="grow">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="!size-9"
                  onClick={() => setFilters({ ...filters, page: 1 })}
                  disabled={filters.page === 1}
                >
                  <ChevronsLeftIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="!size-9"
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page - 1 })
                  }
                  disabled={filters.page <= 1}
                >
                  <ChevronLeftIcon size={16} />
                </Button>
              </PaginationItem>
              {showLeftEllipsis && <PaginationEllipsis />}
              {pages.map((page) => (
                <PaginationItem key={page}>
                  <Button
                    className="!size-9"
                    variant={filters.page === page ? "outline" : "ghost"}
                    onClick={() => setFilters({ ...filters, page })}
                  >
                    {page}
                  </Button>
                </PaginationItem>
              ))}
              {showRightEllipsis && <PaginationEllipsis />}
              <PaginationItem>
                <Button
                  variant="outline"
                  className="!size-9"
                  onClick={() =>
                    setFilters({ ...filters, page: filters.page + 1 })
                  }
                  disabled={filters.page >= table.getPageCount()}
                >
                  <ChevronRightIcon size={16} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  className="!size-9"
                  onClick={() =>
                    setFilters({ ...filters, page: table.getPageCount() })
                  }
                  disabled={filters.page >= table.getPageCount()}
                >
                  <ChevronsRightIcon size={16} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div className="flex flex-1 justify-end">
          <Select
            value={filters.limit.toString()}
            onValueChange={(value) =>
              setFilters({ ...filters, page: 1, limit: Number(value) })
            }
          >
            <SelectTrigger className="!h-9 w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
