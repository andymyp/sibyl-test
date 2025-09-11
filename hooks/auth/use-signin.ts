import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { client } from "@/lib/hono/client";
import { InferRequestType, InferResponseType } from "hono";

type ReqType = InferRequestType<typeof client.auth.signin.$post>["json"];
type ResType = InferResponseType<typeof client.auth.signin.$post>;

export function useSignIn() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const action = useMutation<ResType, Error, ReqType>({
    mutationFn: async (json) => {
      dispatch(AppAction.setLoading(true));

      const res = await client.auth.signin.$post({ json });

      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    },
    onSuccess: (user) => {
      const userRole = user?.user_metadata.role;

      if (userRole === "CLIENT") {
        return router.replace("/client/dashboard");
      }

      return router.replace("/lawyer/marketplace");
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    signIn: action.mutateAsync,
    isLoading: action.isPending,
  };
}
