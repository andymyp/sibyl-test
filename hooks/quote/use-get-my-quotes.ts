import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";
import { IQuotesParams } from "@/lib/types/quote-type";

type ResType = InferResponseType<typeof client.quotes.$get>;

export const useGetMyQuotes = (userId: string, query: IQuotesParams) => {
  const action = useQuery<ResType>({
    queryKey: ["myquotes", userId, query.status, query.page, query.limit],
    queryFn: async () => {
      const res = await client.quotes.$get({ query });
      return res.json();
    },
  });

  return {
    quotes: action.data?.quotes || [],
    totalQuotes: action.data?.total || 0,
    isGettingQuotes: action.isPending,
    isRefreshingQuotes: action.isRefetching,
    refreshQuotes: action.refetch,
  };
};
