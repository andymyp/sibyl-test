import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";

type ResType = InferResponseType<(typeof client.cases)[":id"]["$get"]>;

export const useGetMyCase = (userId: string, id: string) => {
  const action = useQuery<ResType>({
    queryKey: ["mycase", userId, id],
    queryFn: async () => {
      const res = await client.cases[":id"]["$get"]({ param: { id } });
      return res.json();
    },
  });

  return {
    case: action.data,
    isGettingCase: action.isPending,
  };
};
