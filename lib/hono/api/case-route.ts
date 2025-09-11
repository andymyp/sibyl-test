/* eslint-disable @typescript-eslint/no-explicit-any */
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createClient } from "@/lib/supabase/server";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import { CaseSchema } from "@/lib/schemas/case-schema";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware";
import { CaseStatus, QuoteStatus, Role } from "@/lib/generated/prisma";

export const caseRoute = new Hono()
  .post(
    "/",
    authMiddleware(Role.CLIENT),
    zValidator("form", CaseSchema),
    async (c) => {
      try {
        const supabase = await createClient();
        const userId = c.get("userId");

        const { files, ...req } = c.req.valid("form");

        const legalCase = await prisma.legalCase.create({
          data: {
            ...req,
            clientId: userId,
          },
        });

        let uploadResults: any[] = [];

        if (files) {
          try {
            uploadResults = await Promise.all(
              files.map(async (file) => {
                const storageKey = `${legalCase.id}/${file.name}`;

                const { error: uploadError } = await supabase.storage
                  .from("case-files")
                  .upload(storageKey, file);

                if (uploadError) {
                  throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
                    message: `Upload failed: ${file.name} - ${uploadError.message}`,
                  });
                }

                return {
                  caseId: legalCase.id,
                  storageKey,
                  filename: file.name,
                  mimeType: file.type,
                  size: file.size,
                };
              })
            );
          } catch (uploadErr) {
            await prisma.legalCase.delete({ where: { id: legalCase.id } });

            throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
              message: "Upload failed",
              cause: uploadErr,
            });
          }
        }

        if (uploadResults.length > 0) {
          await prisma.$transaction([
            prisma.caseFile.createMany({
              data: uploadResults,
            }),
          ]);
        }

        return c.json(legalCase, StatusCodes.CREATED);
      } catch (error: any) {
        throw new HTTPException(error?.status || 500, {
          message: error?.message || "Internal Server Error",
        });
      }
    }
  )
  .get("/my-stats", authMiddleware(Role.CLIENT), async (c) => {
    try {
      const userId = c.get("userId");

      const [total, open, engaged, totalQuotes] = await Promise.all([
        prisma.legalCase.count({ where: { clientId: userId } }),
        prisma.legalCase.count({
          where: { clientId: userId, status: CaseStatus.OPEN },
        }),
        prisma.legalCase.count({
          where: { clientId: userId, status: CaseStatus.ENGAGED },
        }),
        prisma.quote.count({
          where: {
            legalCase: { clientId: userId },
          },
        }),
      ]);

      return c.json({ total, open, engaged, totalQuotes }, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  })
  .get("/", authMiddleware(Role.CLIENT), async (c) => {
    try {
      const userId = c.get("userId");

      const { search, page, limit } = c.req.query();

      const where: any = {
        clientId: userId,
      };

      if (search && search !== "" && search !== "null") {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      let paginate: { skip: number; take: number } | undefined = undefined;
      if (page && limit) {
        const skip = (Number(page) - 1) * Number(limit);
        paginate = {
          skip,
          take: Number(limit),
        };
      }

      const [total, cases] = await Promise.all([
        prisma.legalCase.count({
          where,
        }),
        prisma.legalCase.findMany({
          where,
          include: {
            _count: { select: { quotes: true, files: true } },
          },
          orderBy: { createdAt: "desc" },
          ...paginate,
        }),
      ]);

      return c.json({ total, cases }, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  })
  .get("/marketplace", authMiddleware(Role.LAWYER), async (c) => {
    try {
      const userId = c.get("userId");
      const { search, category, created_since, page, limit } = c.req.query();

      const where: any = {
        status: CaseStatus.OPEN,
      };

      if (search && search !== "" && search !== "null") {
        where.OR = [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ];
      }

      if (category && category !== "" && category !== "null") {
        where.category = category;
      }

      if (created_since && created_since !== "" && created_since !== "null") {
        where.createdAt = { gte: new Date(created_since) };
      }

      let paginate: { skip: number; take: number } | undefined = undefined;
      if (page && limit) {
        const skip = (Number(page) - 1) * Number(limit);
        paginate = {
          skip,
          take: Number(limit),
        };
      }

      const [total, cases] = await Promise.all([
        prisma.legalCase.count({
          where,
        }),
        prisma.legalCase.findMany({
          where,
          include: {
            quotes: { where: { lawyerId: userId } },
            _count: { select: { files: true } },
          },
          orderBy: { createdAt: "desc" },
          ...paginate,
        }),
      ]);

      return c.json({ total, cases }, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  })
  .get("/:id", authMiddleware(Role.CLIENT), async (c) => {
    try {
      const id = c.req.param("id");
      const userId = c.get("userId");

      const legalCase = await prisma.legalCase.findFirst({
        where: {
          id,
          clientId: userId,
        },
        include: {
          files: true,
          quotes: {
            include: {
              lawyer: true,
            },
          },
        },
      });

      return c.json(legalCase, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  })
  .get("/marketplace/:id", authMiddleware(Role.LAWYER), async (c) => {
    try {
      const userId = c.get("userId");
      const id = c.req.param("id");

      const legalCase = await prisma.legalCase.findFirst({
        where: {
          id,
          status: CaseStatus.OPEN,
        },
        include: {
          quotes: {
            where: { lawyerId: userId },
          },
          _count: { select: { files: true } },
        },
      });

      return c.json(legalCase, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  })
  .get("/lawyer/:id", authMiddleware(Role.LAWYER), async (c) => {
    try {
      const userId = c.get("userId");
      const id = c.req.param("id");

      const legalCase = await prisma.legalCase.findFirst({
        where: {
          id,
          status: CaseStatus.ENGAGED,
        },
        include: {
          client: true,
          files: true,
          quotes: {
            where: {
              lawyerId: userId,
              status: QuoteStatus.ACCEPTED,
            },
          },
        },
      });

      return c.json(legalCase, StatusCodes.OK);
    } catch (error: any) {
      throw new HTTPException(error?.status || 500, {
        message: error?.message || "Internal Server Error",
      });
    }
  });
