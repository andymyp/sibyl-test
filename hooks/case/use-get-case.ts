import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";

type ResType = InferResponseType<
  (typeof client.cases.marketplace)[":id"]["$get"]
>;

export const useGetCase = (id: string) => {
  const action = useQuery<ResType>({
    queryKey: ["case", id],
    queryFn: async () => {
      const res = await client.cases.marketplace[":id"]["$get"]({
        param: { id },
      });
      return res.json();
    },
  });

  return {
    case: action.data,
    isGettingCase: action.isPending,
  };
};
