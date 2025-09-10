import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";

type ResType = InferResponseType<typeof client.quotes.stats.$get>;

export const useGetStatsQuotes = (userId: string) => {
  const action = useQuery<ResType>({
    queryKey: ["quotes-stats", userId],
    queryFn: async () => {
      const res = await client.quotes.stats.$get();
      return res.json();
    },
  });

  return {
    total: action.data?.total ?? 0,
    proposed: action.data?.proposed ?? 0,
    accepted: action.data?.accepted ?? 0,
    rejected: action.data?.rejected ?? 0,
  };
};
