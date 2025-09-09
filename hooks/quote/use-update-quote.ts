import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { IUpdateQuote } from "@/lib/types/quote-type";

export const useUpdateQuote = () => {
  const supabase = createClient();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const action = useMutation<{ id: string }, Error, IUpdateQuote>({
    mutationFn: async ({ id, ...payload }) => {
      dispatch(AppAction.setLoading(true));

      const { error } = await supabase
        .from("Quote")
        .update({
          ...payload,
        })
        .eq("id", id);

      if (error) throw error;
      return { id };
    },
    onSuccess: async () => {
      toast.success("Quote updated");

      await queryClient.invalidateQueries({
        queryKey: ["case"],
      });
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    updateQuote: action.mutateAsync,
    isUpdatingQuote: action.isPending,
  };
};
