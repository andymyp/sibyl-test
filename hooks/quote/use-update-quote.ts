import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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

  const action = useMutation<ResType, Error, ReqType>({
    mutationFn: async (json) => {
      dispatch(AppAction.setLoading(true));

      const res = await client.quotes[":id"]["$patch"]({
        param: { id: id ? id : "" },
        json,
      });

      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    },
    onSuccess: async () => {
      toast.success("Quote updated");

      await queryClient.invalidateQueries({
        queryKey: ["case"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["myquotes"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["quotes-stats"],
      });

      router.push("/lawyer/my-quotes");
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    updateQuote: action.mutateAsync,
    isUpdatingQuote: action.isPending,
  };
};
