import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "@/lib/generated/prisma";
import { IQuoteWithLawyer } from "@/lib/types/case-type";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

export const useAcceptQuote = () => {
  const supabase = createClient();
  const dispatch = useDispatch<AppDispatch>();
  const stripe = useStripe();
  const elements = useElements();

  const paymentId = uuidv4();

  const action = useMutation<{ paymentId: string }, Error, IQuoteWithLawyer>({
    mutationFn: async (payload) => {
      if (!stripe || !elements) throw new Error("Stripe not loaded");

      dispatch(AppAction.setLoading(true));

      const { data: payment, error: paymentError } = await supabase
        .from("Payment")
        .insert({
          id: paymentId,
          quoteId: payload.id,
          stripeIntentId: "",
          amount: payload.amount,
          status: PaymentStatus.PENDING,
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      const { data: pi, error: piError } = await supabase.functions.invoke(
        "create-payment-intent",
        {
          body: { amount: payment.amount, paymentId: payment.id },
        }
      );

      if (piError) throw piError;

      const result = await stripe.confirmCardPayment(pi.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        await supabase
          .from("Payment")
          .update({ status: "FAILED" })
          .eq("id", paymentId);
        throw result.error;
      } else if (result.paymentIntent?.status === "succeeded") {
        await supabase
          .from("Payment")
          .update({ status: "SUCCEEDED" })
          .eq("id", paymentId);

        await supabase
          .from("Quote")
          .update({ status: "ACCEPTED" })
          .eq("id", payload.id);

        await supabase
          .from("Quote")
          .update({ status: "REJECTED" })
          .neq("id", payload.id)
          .eq("caseId", payload.caseId);

        await supabase
          .from("LegalCase")
          .update({ status: "ENGAGED" })
          .eq("id", payload.caseId);
      }

      return { paymentId };
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    createPayment: action.mutateAsync,
    isCreatingPayment: action.isPending,
  };
};
