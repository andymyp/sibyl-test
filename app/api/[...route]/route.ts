import { handle } from "hono/vercel";
import honoApp from "@/lib/hono/server";

export const GET = handle(honoApp);
export const POST = handle(honoApp);
export const PATCH = handle(honoApp);
export const DELETE = handle(honoApp);
