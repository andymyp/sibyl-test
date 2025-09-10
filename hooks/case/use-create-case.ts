import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { ICreateCase } from "@/lib/types/case-type";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "@bprogress/next";

export const useCreateCase = () => {
  const supabase = createClient();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();

  const caseId = uuidv4();

  const action = useMutation<{ caseId: string }, Error, ICreateCase>({
    mutationFn: async (payload) => {
      dispatch(AppAction.setLoading(true));

      const { error: caseError } = await supabase.from("LegalCase").insert({
        id: caseId,
        clientId: payload.clientId,
        title: payload.title,
        category: payload.category,
        description: payload.description,
      });

      if (caseError) throw caseError;

      const caseFiles = [];

      for (const file of payload.files) {
        const storageKey = `${caseId}/${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("case-files")
          .upload(storageKey, file);

        if (uploadError) throw uploadError;

        caseFiles.push({
          id: uuidv4(),
          caseId,
          storageKey,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        });
      }

      if (caseFiles.length > 0) {
        const { error: metaError } = await supabase
          .from("CaseFile")
          .insert(caseFiles);

        if (metaError) throw metaError;
      }

      return { caseId };
    },
    onSuccess: async () => {
      toast.success("Case created");

      await queryClient.invalidateQueries({
        queryKey: ["mycases"],
      });

      router.push("/client/dashboard");
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    createCase: action.mutateAsync,
    isCreatingCase: action.isPending,
  };
};
