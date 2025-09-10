"use client";

import { z } from "zod";
import { Loader2, Mail, User } from "lucide-react";
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
import { Role } from "@/lib/generated/prisma";

type FormValues = z.infer<typeof SignUpSchema>;

export function SignUpClientForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: Role.CLIENT,
    },
  });

  const { isLoading, signUp } = useSignUp();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    await signUp(data);
    form.reset();
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
                  disabled={form.formState.isSubmitting || isLoading}
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
                  disabled={form.formState.isSubmitting || isLoading}
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
                  disabled={form.formState.isSubmitting || isLoading}
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
                  disabled={form.formState.isSubmitting || isLoading}
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
          disabled={form.formState.isSubmitting || isLoading}
          className="w-full mt-4"
        >
          {(form.formState.isSubmitting || isLoading) && (
            <Loader2 className="animate-spin text-white" />
          )}
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
