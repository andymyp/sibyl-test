import { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";

export const errorHandler = (err: Error | HTTPException, c: Context) => {
  console.log("=== Caught Error ===");
  if (err instanceof HTTPException) {
    return c.text(err.message, err.status);
  }
  if (err instanceof z.ZodError) {
    return c.text(err.message, 400);
  }
  console.error(err);
  return c.text("Something went wrong", 500);
};
