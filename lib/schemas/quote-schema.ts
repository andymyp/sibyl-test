import z from "zod";

export const QuoteSchema = z.object({
  amountCents: z.number().min(1, "Amount is required"),
  expectedDays: z.number().min(1, "Expected days is required"),
  note: z.string().min(1, "Note is required"),
});
