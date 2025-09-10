import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createClient } from "@/lib/supabase/client";
import { ISignUp } from "@/lib/types/auth-type";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { Role } from "@/lib/generated/prisma";

export function useSignUp(role: Role) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const supabase = createClient();

  const action = useMutation<User | null, Error, ISignUp>({
    mutationFn: async ({ password, confirm_password, ...payload }) => {
      dispatch(AppAction.setLoading(true));

      const { data, error } = await supabase.auth.signUp({
        email: payload.email,
        password: password,
        options: {
          data: {
            ...payload,
            displayName: payload.name,
            role,
          },
        },
      });

      if (error) throw error;

      const insert = await supabase.from("User").insert({
        ...payload,
        id: data.user?.id,
        role,
      });

      if (insert.error) throw insert.error;

      return data.user;
    },
    onSuccess: async (user) => {
      toast.success("Success. Sign in...");

      const userRole = user?.user_metadata?.role;

      if (userRole === "CLIENT") {
        return router.replace("/client/dashboard");
      }

      return router.replace("/lawyer/marketplace");
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    signUp: action.mutateAsync,
    isLoading: action.isPending,
  };
}
