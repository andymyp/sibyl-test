import { ICasesParams } from "@/lib/types/case-type";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";

type ResType = InferResponseType<typeof client.cases.marketplace.$get>;

export const useGetCases = (query: ICasesParams) => {
  const action = useQuery<ResType>({
    queryKey: [
      "cases",
      query.search,
      query.category,
      query.created_since,
      query.page,
      query.limit,
    ],
    queryFn: async () => {
      const res = await client.cases.marketplace.$get({ query });
      return res.json();
    },
  });

  return {
    cases: action.data?.cases || [],
    totalCases: action.data?.total || 0,
    isGettingCases: action.isPending,
    isRefreshingCases: action.isRefetching,
    refreshCases: action.refetch,
  };
};
