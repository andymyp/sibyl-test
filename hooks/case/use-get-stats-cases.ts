import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";

type ResType = InferResponseType<(typeof client.cases)["my-stats"]["$get"]>;

export const useGetStatsCases = (userId: string) => {
  const action = useQuery<ResType>({
    queryKey: ["my-cases-stats", userId],
    queryFn: async () => {
      const res = await client.cases["my-stats"]["$get"]();
      return res.json();
    },
  });

  return {
    total: action.data?.total ?? 0,
    open: action.data?.open ?? 0,
    engaged: action.data?.engaged ?? 0,
    totalQuotes: action.data?.totalQuotes ?? 0,
  };
};
