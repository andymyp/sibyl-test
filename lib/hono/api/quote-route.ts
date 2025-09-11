/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware";
import { QuoteStatus, Role } from "@/lib/generated/prisma";
import { QuoteSchema } from "@/lib/schemas/quote-schema";
import { HTTPException } from "hono/http-exception";

export const quoteRoute = new Hono()
  .post(
    "/",
    authMiddleware(Role.LAWYER),
    zValidator("json", QuoteSchema),
    async (c) => {
      try {
        const userId = c.get("userId");
        const req = c.req.valid("json");

        const quote = await prisma.quote.create({
          data: {
            ...req,
            lawyerId: userId,
          },
        });

        return c.json(quote, StatusCodes.CREATED);
      } catch (error: any) {
        throw new HTTPException(error?.status || 500, {
          message: error?.message || "Internal Server Error",
        });
      }
    }
  )
  .get("/stats", authMiddleware(Role.LAWYER), async (c) => {
    try {
      const userId = c.get("userId");

      const [total, proposed, accepted, rejected] = await Promise.all([
        prisma.quote.count({ where: { lawyerId: userId } }),
        prisma.quote.count({
          where: { lawyerId: userId, status: QuoteStatus.PROPOSED },
        }),
        prisma.quote.count({
          where: { lawyerId: userId, status: QuoteStatus.ACCEPTED },
        }),
        prisma.quote.count({
          where: { lawyerId: userId, status: QuoteStatus.REJECTED },
        }),
      ]);

      return c.json({ total, proposed, accepted, rejected }, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  })
  .get("/", authMiddleware(Role.LAWYER), async (c) => {
    try {
      const userId = c.get("userId");

      const { status, page, limit } = c.req.query();

      const where: any = {
        lawyerId: userId,
      };

      if (status && status !== "" && status !== "null") {
        where.status = status;
      }

      let paginate: { skip: number; take: number } | undefined = undefined;
      if (page && limit) {
        const skip = (Number(page) - 1) * Number(limit);
        paginate = {
          skip,
          take: Number(limit),
        };
      }

      const [total, quotes] = await Promise.all([
        prisma.quote.count({
          where,
        }),
        prisma.quote.findMany({
          where,
          include: {
            legalCase: true,
          },
          orderBy: { createdAt: "desc" },
          ...paginate,
        }),
      ]);

      return c.json({ total, quotes }, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  })
  .patch(
    "/:id",
    authMiddleware(Role.LAWYER),
    zValidator("json", QuoteSchema),
    async (c) => {
      try {
        const id = c.req.param("id");
        const userId = c.get("userId");
        const req = c.req.valid("json");

        const quote = await prisma.quote.update({
          where: {
            id,
            lawyerId: userId,
          },
          data: req,
        });

        return c.json(quote, StatusCodes.OK);
      } catch (error: any) {
        throw new HTTPException(error?.status || 500, {
          message: error?.message || "Internal Server Error",
        });
      }
    }
  );
