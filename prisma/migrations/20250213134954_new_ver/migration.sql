/*
  Warnings:

  - You are about to drop the column `userID` on the `ActivationToken` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `ActivationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ActivationToken` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ActivationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ActivationToken" ("id", "token") SELECT "id", "token" FROM "ActivationToken";
DROP TABLE "ActivationToken";
ALTER TABLE "new_ActivationToken" RENAME TO "ActivationToken";
CREATE UNIQUE INDEX "ActivationToken_token_key" ON "ActivationToken"("token");
CREATE UNIQUE INDEX "ActivationToken_userId_key" ON "ActivationToken"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
