/*
  Warnings:

  - The primary key for the `ActivationToken` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tokenID` on the `ActivationToken` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userID` on the `User` table. All the data in the column will be lost.
  - The required column `id` was added to the `ActivationToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ActivationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userID" TEXT NOT NULL,
    CONSTRAINT "ActivationToken_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ActivationToken" ("token", "userID") SELECT "token", "userID" FROM "ActivationToken";
DROP TABLE "ActivationToken";
ALTER TABLE "new_ActivationToken" RENAME TO "ActivationToken";
CREATE UNIQUE INDEX "ActivationToken_token_key" ON "ActivationToken"("token");
CREATE UNIQUE INDEX "ActivationToken_userID_key" ON "ActivationToken"("userID");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "isActive", "passwordHash", "updatedAt", "username") SELECT "createdAt", "email", "isActive", "passwordHash", "updatedAt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
