/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Book` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IssuedBook` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'SUPERADMIN', 'LIBRARIAN');

-- CreateEnum
CREATE TYPE "BookLoanStatus" AS ENUM ('REQUESTED', 'IN_STOCK', 'ISSUED');

-- CreateEnum
CREATE TYPE "BookLoanRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "BookSecurityDepositState" AS ENUM ('ACTIVE', 'UNACTIVE');

-- CreateEnum
CREATE TYPE "BookPaymentMethod" AS ENUM ('CASH', 'TRANSFER', 'DIGITAL');

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_author_id_fkey";

-- DropForeignKey
ALTER TABLE "Book" DROP CONSTRAINT "Book_cat_id_fkey";

-- DropForeignKey
ALTER TABLE "IssuedBook" DROP CONSTRAINT "IssuedBook_book_id_fkey";

-- DropForeignKey
ALTER TABLE "IssuedBook" DROP CONSTRAINT "IssuedBook_user_id_fkey";

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "Book";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "IssuedBook";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "BookStatus";

-- CreateTable
CREATE TABLE "UserAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "img" TEXT,

    CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book_ratings" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "bookTitleId" TEXT NOT NULL,

    CONSTRAINT "book_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookTitle" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "book_price" TEXT NOT NULL DEFAULT '0',
    "stock" INTEGER NOT NULL DEFAULT 1,
    "img" TEXT,

    CONSTRAINT "BookTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCopy" (
    "id" TEXT NOT NULL,
    "bookTitleId" TEXT NOT NULL,
    "copy_number" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookCopy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookAuthor" (
    "id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,

    CONSTRAINT "BookAuthor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookLoan" (
    "id" TEXT NOT NULL,
    "bookCopyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "BookLoanStatus" NOT NULL DEFAULT 'ISSUED',
    "loanDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnDate" TIMESTAMP(3),

    CONSTRAINT "BookLoan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BookCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookLoanRequest" (
    "id" TEXT NOT NULL,
    "bookCopyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "BookLoanRequestStatus" NOT NULL DEFAULT 'PENDING',
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptanceDate" TIMESTAMP(3),
    "description" TEXT,
    "bookSecurityDepositId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookLoanRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookSecurityDeposit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookCopyId" TEXT NOT NULL,
    "amount" TEXT NOT NULL DEFAULT '0',
    "refundDate" TIMESTAMP(3),
    "refundedAmount" TEXT NOT NULL DEFAULT '0',
    "depositDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidDate" TIMESTAMP(3),
    "returnDate" TIMESTAMP(3),
    "state" "BookSecurityDepositState" NOT NULL DEFAULT 'ACTIVE',
    "paymentMethod" "BookPaymentMethod" NOT NULL DEFAULT 'CASH',
    "paymentReference" TEXT,

    CONSTRAINT "BookSecurityDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BookCategoryToBookTitle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BookCategoryToBookTitle_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_username_key" ON "UserAccount"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccount_dni_key" ON "UserAccount"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "BookTitle_title_key" ON "BookTitle"("title");

-- CreateIndex
CREATE INDEX "BookTitle_title_authorId_idx" ON "BookTitle"("title", "authorId");

-- CreateIndex
CREATE UNIQUE INDEX "BookAuthor_author_name_key" ON "BookAuthor"("author_name");

-- CreateIndex
CREATE UNIQUE INDEX "BookCategory_name_key" ON "BookCategory"("name");

-- CreateIndex
CREATE INDEX "BookCategory_name_idx" ON "BookCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BookLoanRequest_bookSecurityDepositId_key" ON "BookLoanRequest"("bookSecurityDepositId");

-- CreateIndex
CREATE INDEX "_BookCategoryToBookTitle_B_index" ON "_BookCategoryToBookTitle"("B");

-- AddForeignKey
ALTER TABLE "book_ratings" ADD CONSTRAINT "book_ratings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book_ratings" ADD CONSTRAINT "book_ratings_bookTitleId_fkey" FOREIGN KEY ("bookTitleId") REFERENCES "BookTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookTitle" ADD CONSTRAINT "BookTitle_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "BookAuthor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookCopy" ADD CONSTRAINT "BookCopy_bookTitleId_fkey" FOREIGN KEY ("bookTitleId") REFERENCES "BookTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoan" ADD CONSTRAINT "BookLoan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoan" ADD CONSTRAINT "BookLoan_bookCopyId_fkey" FOREIGN KEY ("bookCopyId") REFERENCES "BookCopy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoanRequest" ADD CONSTRAINT "BookLoanRequest_bookCopyId_fkey" FOREIGN KEY ("bookCopyId") REFERENCES "BookCopy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoanRequest" ADD CONSTRAINT "BookLoanRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookLoanRequest" ADD CONSTRAINT "BookLoanRequest_bookSecurityDepositId_fkey" FOREIGN KEY ("bookSecurityDepositId") REFERENCES "BookSecurityDeposit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSecurityDeposit" ADD CONSTRAINT "BookSecurityDeposit_bookCopyId_fkey" FOREIGN KEY ("bookCopyId") REFERENCES "BookCopy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookSecurityDeposit" ADD CONSTRAINT "BookSecurityDeposit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCategoryToBookTitle" ADD CONSTRAINT "_BookCategoryToBookTitle_A_fkey" FOREIGN KEY ("A") REFERENCES "BookCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BookCategoryToBookTitle" ADD CONSTRAINT "_BookCategoryToBookTitle_B_fkey" FOREIGN KEY ("B") REFERENCES "BookTitle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
