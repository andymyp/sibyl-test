import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useGetCase = (id: string) => {
  const supabase = createClient();

  const action = useQuery({
    queryKey: ["case", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("LegalCase")
        .select(
          `
          *,
          client:User!clientId(*),
          files:CaseFile(*),
          quotes:Quote(
            *,
            lawyer:User!lawyerId(*)
          )
  `
        )
        .eq("id", id)
        .eq("status", "OPEN")
        .single();

      if (error) throw error;

      return data;
    },
  });

  return {
    case: action.data,
    isGettingCase: action.isPending,
  };
};
