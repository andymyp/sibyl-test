import { IMyCasesParams } from "@/lib/types/case-type";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";

type ResType = InferResponseType<typeof client.cases.$get>;

export const useGetMyCases = (userId: string, query: IMyCasesParams) => {
  const action = useQuery<ResType>({
    queryKey: ["mycases", userId, query.search, query.page, query.limit],
    queryFn: async () => {
      const res = await client.cases.$get({ query });
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
