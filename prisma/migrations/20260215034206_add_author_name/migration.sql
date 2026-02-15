/*
  Warnings:

  - You are about to drop the column `search_document` on the `BookTitle` table. All the data in the column will be lost.
  - Added the required column `authorName` to the `BookTitle` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookTitle" DROP COLUMN "search_document",
ADD COLUMN     "authorName" TEXT NOT NULL;
