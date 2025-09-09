import { QuoteStatus } from "../generated/prisma";

export interface ICreateQuote {
  caseId: string;
  lawyerId: string;
  amountCents: number;
  expectedDays: number;
  note: string;
}

export interface IUpdateQuote {
  id: string;
  caseId: string;
  lawyerId: string;
  amountCents: number;
  expectedDays: number;
  note: string;
}
