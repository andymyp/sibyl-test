"use client";

import { z } from "zod";
import { Clock, DollarSign, Loader2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuoteSchema } from "@/lib/schemas/quote-schema";
import { useCreateQuote } from "@/hooks/quote/use-create-quote";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateQuote } from "@/hooks/quote/use-update-quote";
import { IQuoteWithLawyer } from "@/lib/types/case-type";
import { LegalCase } from "@/lib/generated/prisma";
import { useEffect } from "react";

interface Props {
  user: User;
  case_: LegalCase;
  existingQuote?: IQuoteWithLawyer;
}

type FormValues = z.infer<typeof QuoteSchema>;

export function QuoteForm({ user, case_, existingQuote }: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      amountCents: 0,
      expectedDays: 0,
      note: "",
    },
  });

  useEffect(() => {
    form.reset({
      amountCents: existingQuote?.amountCents || 0,
      expectedDays: existingQuote?.expectedDays || 0,
      note: existingQuote?.note || "",
    });
  }, [existingQuote]);

  const { isCreatingQuote, createQuote } = useCreateQuote();
  const { isUpdatingQuote, updateQuote } = useUpdateQuote();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (existingQuote) {
      const { lawyer, ...quote } = existingQuote;
      await updateQuote({ ...quote, ...data });
    } else {
      await createQuote({ ...data, caseId: case_.id, lawyerId: user.id });
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amountCents"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Quote Amount (USD) <span className="text-destructive">*</span>
                  <div className="flex items-center mt-1">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      Total project cost
                    </span>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="5000"
                    disabled={
                      form.formState.isSubmitting ||
                      isCreatingQuote ||
                      isUpdatingQuote
                    }
                    {...field}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expectedDays"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  Expected Timeline (Days){" "}
                  <span className="text-destructive">*</span>
                  <div className="flex items-center mt-1">
                    <Clock className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">
                      Project completion time
                    </span>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    placeholder="14"
                    disabled={
                      form.formState.isSubmitting ||
                      isCreatingQuote ||
                      isUpdatingQuote
                    }
                    {...field}
                    onChange={(e) => {
                      const value = e.target.valueAsNumber;
                      field.onChange(isNaN(value) ? 0 : value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Your Approach & Experience{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-20"
                  placeholder="Explain your approach to this case, relevant experience, and what the client can expect from your services..."
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription className="text-xs">
                This will help the client understand your expertise and approach
                to their case
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center w-full mt-4">
          <Button
            type="button"
            variant="outline"
            disabled={
              form.formState.isSubmitting || isCreatingQuote || isUpdatingQuote
            }
            asChild
          >
            <Link href="/lawyer/marketplace">Cancel</Link>
          </Button>
          <Button
            type="submit"
            disabled={
              form.formState.isSubmitting || isCreatingQuote || isUpdatingQuote
            }
          >
            {(form.formState.isSubmitting ||
              isCreatingQuote ||
              isUpdatingQuote) && (
              <Loader2 className="animate-spin text-white" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
