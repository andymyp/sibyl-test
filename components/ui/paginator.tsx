"use client";

import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "./pagination";
import { Button } from "./button";

interface Props {
  count: number;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (page: number) => void;
  rowPerPage: Array<number>;
}

export function Paginator({
  count,
  page,
  setPage,
  limit,
  setLimit,
  rowPerPage,
}: Props) {
  let totalPages = Math.ceil(count / limit);

  if (Number.isNaN(totalPages)) {
    totalPages = 0;
  }

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage: page,
    totalPages: totalPages,
    paginationItemsToDisplay: 5,
  });

  return (
    <div className="flex items-center justify-between gap-3 max-sm:flex-col">
      <p
        className="text-muted-foreground flex-1 text-sm whitespace-nowrap"
        aria-live="polite"
      >
        Page <span className="text-foreground">{page}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </p>

      <div className="grow">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                variant="outline"
                className="!size-10 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setPage(Math.max(page - 1, 1))}
                disabled={page === 1}
              >
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>

            {showLeftEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {pages.map((pageNumber) => {
              const isActive = pageNumber === page;

              return (
                <PaginationItem key={pageNumber}>
                  <Button
                    className="!size-10"
                    variant={`${isActive ? "outline" : "ghost"}`}
                    onClick={() => setPage(pageNumber)}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {pageNumber}
                  </Button>
                </PaginationItem>
              );
            })}

            {showRightEllipsis && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <Button
                variant="outline"
                className="!size-10 disabled:pointer-events-none disabled:opacity-50"
                onClick={() => setPage(Math.min(page + 1, totalPages))}
                disabled={page === totalPages || totalPages === 0}
              >
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <div className="flex flex-1 justify-end">
        <Select
          defaultValue={String(limit)}
          onValueChange={(v) => setLimit(Number(v))}
        >
          <SelectTrigger
            id="results-per-page"
            className="w-fit whitespace-nowrap !h-10"
          >
            <SelectValue placeholder="Row per page" />
          </SelectTrigger>
          <SelectContent>
            {rowPerPage.map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
