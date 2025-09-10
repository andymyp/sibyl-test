/* eslint-disable @typescript-eslint/no-unused-vars */
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoute } from "./api/auth-route";
import { caseRoute } from "./api/case-route";
import { quoteRoute } from "./api/quote-route";

export const runtime = "edge";

const app = new Hono().basePath("/api");

const routes = app
  .use("/*", cors())
  .route("/auth", authRoute)
  .route("/cases", caseRoute)
  .route("/quotes", quoteRoute);

export default app;
export type AppType = typeof routes;
