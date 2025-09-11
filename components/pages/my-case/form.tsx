"use client";

import { CardElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  amount: number;
}

export function PaymentCardForm({
  onSubmit,
  onCancel,
  isLoading,
  amount,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="border rounded-2xl p-2 shadow-sm bg-white">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: "16px",
                color: "#1f2937",
                "::placeholder": { color: "#9ca3af" },
                fontFamily: "Inter, system-ui, sans-serif",
                padding: "12px",
              },
              invalid: { color: "#dc2626" },
              complete: { color: "#16a34a" },
            },
          }}
          className="p-3 rounded-lg border border-gray-200"
        />
      </div>

      <div className="space-y-4">
        <Button
          className="w-full h-11 rounded-xl font-medium"
          disabled={isLoading}
          onClick={onSubmit}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            `Pay $${(amount / 100).toLocaleString()}`
          )}
        </Button>
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl font-medium"
          disabled={isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
