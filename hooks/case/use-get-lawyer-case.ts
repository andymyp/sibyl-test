import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono/client";
import { InferResponseType } from "hono";

type ResType = InferResponseType<(typeof client.cases.lawyer)[":id"]["$get"]>;

export const useGetLawyerCase = (userId: string, id: string) => {
  const action = useQuery<ResType>({
    queryKey: ["lawyercase", userId, id],
    queryFn: async () => {
      const res = await client.cases.lawyer[":id"]["$get"]({ param: { id } });
      return await res.json();
    },
  });

  return {
    case_: action.data,
    isGettingCase: action.isPending,
  };
};
