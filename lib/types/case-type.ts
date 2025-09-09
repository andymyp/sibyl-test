import { LegalCase, Quote, User, CaseFile } from "@/lib/generated/prisma";

export interface ICasesParams {
  search: string | null;
  category: string | null;
  created_since: Date | null;
  page: number;
  limit: number;
}

export interface ILegalCaseWithRelations extends LegalCase {
  quotes: (Quote & { lawyer: User })[];
  files: CaseFile[];
}
