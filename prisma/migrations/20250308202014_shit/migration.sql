/*
  Warnings:

  - Made the column `returnDate` on table `BookLoan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookCopy" ADD COLUMN     "durationDays" INTEGER;

-- AlterTable
ALTER TABLE "BookLoan" ALTER COLUMN "returnDate" SET NOT NULL;

-- AlterTable
ALTER TABLE "BookTitle" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "lastLoanedAt" TIMESTAMP(3),
ADD COLUMN     "loanCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usuallySearchedBy" TEXT[];
