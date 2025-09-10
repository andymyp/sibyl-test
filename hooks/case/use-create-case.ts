import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { useRouter } from "@bprogress/next";
import { client } from "@/lib/hono/client";
import { InferRequestType, InferResponseType } from "hono";

type ReqType = InferRequestType<typeof client.cases.$post>["form"];
type ResType = InferResponseType<typeof client.cases.$post>;

export const useCreateCase = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const action = useMutation<ResType, string, ReqType>({
    mutationFn: async (form) => {
      dispatch(AppAction.setLoading(true));

      const res = await client.cases.$post({ form });

      if (!res.ok) throw res.text();
      return res.json();
    },
    onSuccess: async () => {
      toast.success("Case created");

      await queryClient.invalidateQueries({
        queryKey: ["mycases"],
      });

      router.push("/client/dashboard");
    },
    onError: (err) => toast.error(err),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    createCase: action.mutateAsync,
    isCreatingCase: action.isPending,
  };
};
