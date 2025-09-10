import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { SignInSchema, SignUpSchema } from "@/lib/schemas/auth-schema";
import { createClient } from "@/lib/supabase/server";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";

export const authRoute = new Hono()
  .post("/signin", zValidator("json", SignInSchema), async (c) => {
    const req = c.req.valid("json");

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword(req);

    if (error) {
      throw new HTTPException(StatusCodes.UNAUTHORIZED, {
        message: error.message,
      });
    }

    return c.json(data.user, StatusCodes.OK);
  })
  .post("/signup", zValidator("json", SignUpSchema), async (c) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, confirm_password, ...req } = c.req.valid("json");

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: req.email,
      password: password,
      options: {
        data: {
          ...req,
          displayName: req.name,
        },
      },
    });

    if (error) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: error.message,
      });
    }

    const insert = await supabase.from("User").insert({
      ...req,
      id: data.user?.id,
    });

    if (insert.error) {
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: insert.error.message,
      });
    }

    return c.json(data.user, StatusCodes.OK);
  });
