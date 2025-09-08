import { z } from "zod";

export const SignInSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SignUpSchema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Confirm password is required"),
    jurisdiction: z.string().optional(),
    barNumber: z.string().optional(),
  })
  .check((ctx) => {
    if (ctx.value.password !== ctx.value.confirm_password) {
      ctx.issues.push({
        code: "custom",
        message: "Passwords is not match",
        path: ["confirm_password"],
        input: ctx.value,
      });
    }
  });
