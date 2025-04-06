/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `createdByEmail` on the `Team` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "createdBy",
DROP COLUMN "createdByEmail",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
