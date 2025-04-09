/*
  Warnings:

  - You are about to drop the column `reactorId` on the `Reaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[type,memberId]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_type_memberId_reactorId_key";

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "reactorId";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_type_memberId_key" ON "Reaction"("type", "memberId");
