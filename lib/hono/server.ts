/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoute } from "./api/auth-route";
import { caseRoute } from "./api/case-route";
import { quoteRoute } from "./api/quote-route";
import { paymentRoute } from "./api/payment-route";
import { HTTPException } from "hono/http-exception";
import { ZodError } from "zod";
import { formatZodError } from "./validator";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof ZodError) {
    const newError = formatZodError(err);
    return c.text(`[Validation] ${newError}`, 400);
  }

  if (err instanceof HTTPException) {
    if (!(err.status && err.status >= 400 && err.status < 500)) {
      console.error("[HTTPException]", err.message);
    }

    return err.getResponse();
  }

  console.error("[UnhandledError]", err);
  return c.text("Internal Server Error", 500);
});

const routes = app
  .use("/*", cors())
  .route("/auth", authRoute)
  .route("/cases", caseRoute)
  .route("/quotes", quoteRoute)
  .route("/pay", paymentRoute);

export default app;
export type AppType = typeof routes;
