import { PaymentStatus, QuoteStatus } from "../generated/prisma";

export interface IQuote {
  id: string;
  caseId: string;
  lawyerId: string;
  engagedQuoteId: string;
  amountCents: number;
  expectedDays: number;
  note: string;
  status: QuoteStatus;
  createdAt: string;
}

export interface IPayment {
  id: string;
  quoteId: string;
  stripeIntentId: string;
  amountCents: number;
  status: PaymentStatus;
  createdAt: string;
}
