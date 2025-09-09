import { createClient } from "@/lib/supabase/client";
import { ICasesParams } from "@/lib/types/case-type";
import { useQuery } from "@tanstack/react-query";

export const useGetCases = (params: ICasesParams) => {
  const supabase = createClient();

  const action = useQuery({
    queryKey: [
      "cases",
      params?.search,
      params?.category,
      params?.created_since,
      params?.page,
      params?.limit,
    ],
    queryFn: async () => {
      const { search, category, created_since, page, limit } = params;

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
        .eq("status", "OPEN")
        .order("createdAt", { ascending: false });

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      if (category) {
        query = query.eq("category", category);
      }

      if (created_since) {
        query = query.gte("createdAt", new Date(created_since).toISOString());
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
