import { Quote } from "../generated/prisma";
import { ILegalCaseWithRelations } from "./case-type";

export interface ICreateQuote {
  caseId: string;
  lawyerId: string;
  amount: number;
  expectedDays: number;
  note: string;
}

export interface IUpdateQuote {
  id: string;
  caseId: string;
  lawyerId: string;
  amount: number;
  expectedDays: number;
  note: string;
}

export interface IQuotesParams {
  status?: string | null;
  page: number;
  limit: number;
}
export interface IQuoteWithCase extends Quote {
  legalCase: ILegalCaseWithRelations;
}
