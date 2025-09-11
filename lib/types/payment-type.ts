import { Payment } from "../generated/prisma";
import { IQuoteWithCase } from "./quote-type";

export interface ICreatePayment {
  quoteId: string;
  stripeIntentId: string;
  amount: number;
}

export interface IUpdatePayment {
  id: string;
  quoteId: string;
  stripeIntentId: string;
  amount: number;
  status: string;
}

export interface IPaymentsParams {
  status?: string | null;
  page: number;
  limit: number;
}

export interface IPaymentWithQuote extends Payment {
  quote: IQuoteWithCase;
}
