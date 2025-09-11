import { handle } from "hono/vercel";
import honoApp from "@/lib/hono/server";

const run = handle(honoApp);

export const GET = run;
export const POST = run;
export const PATCH = run;
export const DELETE = run;
