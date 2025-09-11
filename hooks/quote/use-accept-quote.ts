import { AppDispatch } from "@/lib/store";
import { AppAction } from "@/lib/store/slices/app-slice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { client } from "@/lib/hono/client";
import { InferRequestType, InferResponseType } from "hono";
import { PaymentStatus } from "@/lib/generated/prisma";

type ReqType = InferRequestType<(typeof client.pay)[":id"]["$post"]>;
type ResType = InferResponseType<(typeof client.pay)[":id"]["$patch"]>;

export const useAcceptQuote = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();
  const stripe = useStripe();
  const elements = useElements();

  const action = useMutation<ResType, Error, ReqType>({
    mutationFn: async ({ param }) => {
      if (!stripe || !elements) throw new Error("Stripe not loaded");

      dispatch(AppAction.setLoading(true));

      const res = await client.pay[":id"]["$post"]({ param });
      if (!res.ok) throw new Error(await res.text());

      const pi = await res.json();

      if (!pi.clientSecret) {
        throw new Error("clientSecret not found");
      }

      const result = await stripe.confirmCardPayment(pi.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      let payment: ResType;

      if (result.error) {
        const update = await client.pay[":id"]["$patch"]({
          param: { id: pi.paymentId },
          json: { status: PaymentStatus.FAILED },
        });

        if (!update.ok) throw new Error(await res.text());
        throw new Error("Payment failed. Please try again");
      } else if (result.paymentIntent.status === "succeeded") {
        const update = await client.pay[":id"]["$patch"]({
          param: { id: pi.paymentId },
          json: { status: PaymentStatus.SUCCEEDED },
        });

        if (!update.ok) throw new Error(await res.text());
        payment = await update.json();
      } else {
        throw new Error("Payment was not completed");
      }

      return payment;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mycase"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["mycases"],
      });

      toast.success(
        "Payment processed successfully! The lawyer can now access your case details"
      );
    },
    onError: (err) => toast.error(err.message),
    onSettled: () => dispatch(AppAction.setLoading(false)),
  });

  return {
    acceptQuote: action.mutateAsync,
    isAcceptingQuote: action.isPending,
  };
};
