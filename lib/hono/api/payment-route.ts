/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { Hono } from "hono";
import { StatusCodes } from "http-status-codes";
import { prisma } from "@/lib/prisma";
import { authMiddleware } from "../middleware";
import {
  CaseStatus,
  PaymentStatus,
  QuoteStatus,
  Role,
} from "@/lib/generated/prisma";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { UpdatePaySchema } from "@/lib/schemas/pay-schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export const paymentRoute = new Hono()
  .post("/:id", authMiddleware(Role.CLIENT), async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");

    const quote = await prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Quote not found",
      });
    }

    const pi = await stripe.paymentIntents.create({
      amount: quote.amount,
      currency: "usd",
      metadata: {
        quoteId: quote.id,
        caseId: quote.caseId,
        clientId: userId,
      },
    });

    const payment = await prisma.payment.create({
      data: {
        quoteId: quote.id,
        stripeIntentId: pi.id,
        amount: quote.amount,
        status: PaymentStatus.PENDING,
      },
    });

    return c.json(
      { clientSecret: pi.client_secret, paymentId: payment.id },
      StatusCodes.CREATED
    );
  })
  .patch(
    "/:id",
    authMiddleware(Role.CLIENT),
    zValidator("json", UpdatePaySchema),
    async (c) => {
      const id = c.req.param("id");
      const { status } = c.req.valid("json");

      try {
        const payment = await prisma.payment.update({
          where: { id },
          data: { status },
        });

        if (status === PaymentStatus.SUCCEEDED) {
          const acceptQuote = await prisma.quote.update({
            where: { id: payment.quoteId },
            data: { status: QuoteStatus.ACCEPTED },
          });

          await prisma.quote.updateMany({
            where: {
              caseId: acceptQuote.caseId,
              NOT: {
                id: payment.quoteId,
              },
            },
            data: {
              status: QuoteStatus.REJECTED,
            },
          });

          await prisma.legalCase.update({
            where: { id: acceptQuote.caseId },
            data: {
              engagedQuoteId: acceptQuote.id,
              status: CaseStatus.ENGAGED,
            },
          });
        }

        return c.json(payment, StatusCodes.OK);
      } catch (error: any) {
        throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
          message: error.message,
        });
      }
    }
  );
