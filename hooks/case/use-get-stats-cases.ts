import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGetStatsCases = (userId: string) => {
  const supabase = createClient();

  const action = useQuery({
    queryKey: ["stats-cases", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("LegalCase")
        .select("*, Quote (*)", { count: "exact" })
        .eq("clientId", userId);

      if (error) throw error;

      const stats = (data ?? []).reduce(
        (acc, c) => {
          switch (c.status) {
            case "OPEN":
              acc.open += 1;
              break;
            case "ENGAGED":
              acc.engaged += 1;
              break;
            case "REJECTED":
              acc.rejected += 1;
              break;
          }
          acc.total += 1;
          acc.totalQuotes += c.Quote?.length || 0;
          return acc;
        },
        { total: 0, open: 0, engaged: 0, rejected: 0, totalQuotes: 0 }
      );

      return stats;
    },
  });

  return {
    total: action.data?.total ?? 0,
    open: action.data?.open ?? 0,
    engaged: action.data?.engaged ?? 0,
    rejected: action.data?.rejected ?? 0,
    totalQuotes: action.data?.totalQuotes ?? 0,
  };
};
