import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { createClient } from "@/lib/supabase/client";
import { ILogin } from "@/lib/types/auth-type";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export function useSignIn() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const supabase = createClient();

  const action = useMutation<User, Error, ILogin>({
    mutationFn: async (payload) => {
      dispatch(AppAction.setLoading(true));

      const { data, error } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (error) throw error;

      return data.user;
    },
    onSuccess: async (user) => {
      const userRole = user.user_metadata?.role;

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
