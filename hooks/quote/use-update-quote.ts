import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next";
import { client } from "@/lib/hono/client";
import { InferRequestType, InferResponseType } from "hono";

type ReqType = InferRequestType<
  (typeof client.quotes)[":id"]["$patch"]
>["json"];

type ResType = InferResponseType<(typeof client.quotes)[":id"]["$patch"]>;

export const useUpdateQuote = (id?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const action = useMutation<ResType, string, ReqType>({
    mutationFn: async (json) => {
      dispatch(AppAction.setLoading(true));

      const res = await client.quotes[":id"]["$patch"]({
        param: { id: id ? id : "" },
        json,
      });

      if (!res.ok) throw res.text();
      return res.json();
    },
    onSuccess: async () => {
      toast.success("Quote updated");

      await queryClient.invalidateQueries({
        queryKey: ["case"],
      });

      router.push("/lawyer/my-quotes");
    },
    onError: (err) => toast.error(err),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    updateQuote: action.mutateAsync,
    isUpdatingQuote: action.isPending,
  };
};
