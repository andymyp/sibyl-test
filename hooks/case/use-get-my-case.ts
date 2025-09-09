import { createClient } from "@/lib/supabase/client";
import { IMyCasesParams } from "@/lib/types/case-type";
import { useQuery } from "@tanstack/react-query";

export const useGetMyCase = (userId: string, id: string) => {
  const supabase = createClient();

  const action = useQuery({
    queryKey: ["mycase", userId, id],
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
        .eq("clientId", userId)
        .eq("id", id)
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
