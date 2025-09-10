import { createClient } from "@/lib/supabase/client";
import { IQuotesParams } from "@/lib/types/quote-type";
import { useQuery } from "@tanstack/react-query";

export const useGetMyQuotes = (userId: string, params: IQuotesParams) => {
  const supabase = createClient();

  const action = useQuery({
    queryKey: ["myquotes", userId, params.status, params.page, params.limit],
    queryFn: async () => {
      const { status, page, limit } = params;

      let query = supabase
        .from("Quote")
        .select(`*, case_:LegalCase(*, files:CaseFile(*))`, { count: "exact" })
        .eq("lawyerId", userId)
        .order("createdAt", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        quotes: data,
        total: count || 0,
      };
    },
  });

  return {
    quotes: action.data?.quotes || [],
    totalQuotes: action.data?.total || 0,
    isGettingQuotes: action.isPending,
    isRefreshingQuotes: action.isRefetching,
    refreshQuotes: action.refetch,
  };
};
