-- AlterTable
ALTER TABLE "public"."Payment" RENAME COLUMN "amountCents" TO "amount";

-- AlterTable
ALTER TABLE "public"."Quote" RENAME COLUMN "amountCents" TO "amount";
