import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { ICreateQuote } from "@/lib/types/quote-type";
import { QuoteStatus } from "@/lib/generated/prisma";

export const useCreateQuote = () => {
  const supabase = createClient();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const quoteId = uuidv4();

  const action = useMutation<{ quoteId: string }, Error, ICreateQuote>({
    mutationFn: async (payload) => {
      dispatch(AppAction.setLoading(true));

      const { error: quoteError } = await supabase.from("Quote").insert({
        ...payload,
        id: quoteId,
        status: QuoteStatus.PROPOSED,
      });

      if (quoteError) throw quoteError;

      return { quoteId };
    },
    onSuccess: async () => {
      toast.success("Quote submitted successfully");

      await queryClient.invalidateQueries({
        queryKey: ["case"],
      });
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    createQuote: action.mutateAsync,
    isCreatingQuote: action.isPending,
  };
};
