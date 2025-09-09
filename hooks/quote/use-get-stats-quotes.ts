import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGetStatsQuotes = (userId: string) => {
  const supabase = createClient();

  const action = useQuery({
    queryKey: ["stats-quotes", userId],
    queryFn: async () => {
      const statuses = ["PROPOSED", "ACCEPTED", "REJECTED"] as const;

      const results = await Promise.all(
        statuses.map(async (status) => {
          const { count, error } = await supabase
            .from("Quote")
            .select("*", { count: "exact", head: true })
            .eq("lawyerId", userId)
            .eq("status", status);

          if (error) throw error;
          return { status, count: count ?? 0 };
        })
      );

      const { count: total } = await supabase
        .from("Quote")
        .select("*", { count: "exact", head: true })
        .eq("lawyerId", userId);

      return {
        total: total ?? 0,
        proposed: results.find((r) => r.status === "PROPOSED")?.count ?? 0,
        accepted: results.find((r) => r.status === "ACCEPTED")?.count ?? 0,
        rejected: results.find((r) => r.status === "REJECTED")?.count ?? 0,
      };
    },
  });

  return {
    total: action.data?.total,
    proposed: action.data?.proposed,
    accepted: action.data?.accepted,
    rejected: action.data?.rejected,
  };
};
