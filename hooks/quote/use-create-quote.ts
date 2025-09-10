import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next";
import { client } from "@/lib/hono/client";
import { InferRequestType, InferResponseType } from "hono";

type ReqType = InferRequestType<typeof client.quotes.$post>["json"];
type ResType = InferResponseType<typeof client.quotes.$post>;

export const useCreateQuote = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const router = useRouter();

  const action = useMutation<ResType, string, ReqType>({
    mutationFn: async (json) => {
      dispatch(AppAction.setLoading(true));

      const res = await client.quotes.$post({ json });

      if (!res.ok) throw res.text();
      return res.json();
    },
    onSuccess: async () => {
      toast.success("Quote submitted successfully");

      await queryClient.invalidateQueries({
        queryKey: ["case"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["myquotes"],
      });

      router.push("/lawyer/my-quotes");
    },
    onError: (err) => toast.error(err),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    createQuote: action.mutateAsync,
    isCreatingQuote: action.isPending,
  };
};
