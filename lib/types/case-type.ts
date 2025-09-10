import { LegalCase, Quote, User, CaseFile } from "@/lib/generated/prisma";

export interface ICasesParams {
  search?: string | null;
  category?: string | null;
  created_since?: Date | null;
  page: number;
  limit: number;
}

export interface IMyCasesParams {
  search?: string | null;
  page: number;
  limit: number;
}

export interface ILegalCaseWithRelations extends LegalCase {
  quotes: Quote[];
  files: CaseFile[];
}

export interface ICreateCase {
  clientId: string;
  title: string;
  category: string;
  description: string;
  files: File[];
}

export interface IQuoteWithLawyer extends Quote {
  lawyer: User;
}
