import z from "zod";

export const CaseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  files: z.array(z.instanceof(File)),
});
