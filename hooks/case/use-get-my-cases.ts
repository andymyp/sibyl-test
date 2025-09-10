import { createClient } from "@/lib/supabase/client";
import { IMyCasesParams } from "@/lib/types/case-type";
import { useQuery } from "@tanstack/react-query";

export const useGetMyCases = (userId: string, params: IMyCasesParams) => {
  const supabase = createClient();

  const action = useQuery({
    queryKey: ["mycases", userId, params.search, params.page, params.limit],
    queryFn: async () => {
      const { search, page, limit } = params;

      let query = supabase
        .from("LegalCase")
        .select(
          `
            *,
            Quote (*),
            CaseFile (*)
          `,
          { count: "exact" }
        )
        .eq("clientId", userId)
        .order("createdAt", { ascending: false });

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        cases: data,
        total: count || 0,
      };
    },
  });

  return {
    cases: action.data?.cases || [],
    totalCases: action.data?.total || 0,
    isGettingCases: action.isPending,
    isRefreshingCases: action.isRefetching,
    refreshCases: action.refetch,
  };
};
