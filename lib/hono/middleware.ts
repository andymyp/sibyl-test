import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { createClient } from "../supabase/server";
import { Role } from "../generated/prisma";

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
    role: Role;
  }
}

export const authMiddleware = (requireRole: Role) => {
  return async (c: Context, next: Next) => {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      throw new HTTPException(StatusCodes.UNAUTHORIZED, {
        message: error.message,
      });
    }

    if (!user) {
      throw new HTTPException(StatusCodes.UNAUTHORIZED, {
        message: "Unauthorized",
      });
    }

    const role = user.user_metadata.role as Role;

    if (role !== requireRole) {
      throw new HTTPException(StatusCodes.FORBIDDEN, {
        message: "You do not have permission to perform this action",
      });
    }

    c.set("userId", user.id);
    c.set("role", role);

    await next();
  };
};
