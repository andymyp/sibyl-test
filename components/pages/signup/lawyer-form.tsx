"use client";

import { z } from "zod";
import Link from "next/link";
import { Globe2, Hash, Loader2, Mail, User } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpSchema } from "@/lib/schemas/auth-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignUp } from "@/hooks/auth/use-signup";

type FormValues = z.infer<typeof SignUpSchema>;

export function SignUpLawyerForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      jurisdiction: "",
      barNumber: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const { isLoading, signUp } = useSignUp("LAWYER");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await signUp(data);
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col w-full gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Name"
                  rightIcon={User}
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jurisdiction"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Jurisdiction (optional)"
                  rightIcon={Globe2}
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="barNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Bar Number (optional)"
                  rightIcon={Hash}
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Email"
                  rightIcon={Mail}
                  disabled={form.formState.isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Password"
                  type="password"
                  disabled={form.formState.isSubmitting}
                  {...field}
                  toggleablePassword
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  disabled={form.formState.isSubmitting}
                  {...field}
                  toggleablePassword
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full mt-4"
        >
          {form.formState.isSubmitting && (
            <Loader2 className="animate-spin text-white" />
          )}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
