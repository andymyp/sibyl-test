import z from "zod";
import { PaymentStatus } from "../generated/prisma";

export const UpdatePaySchema = z.object({
  status: z.enum(PaymentStatus),
});
