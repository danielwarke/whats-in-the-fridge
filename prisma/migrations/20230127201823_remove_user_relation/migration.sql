/*
  Warnings:

  - You are about to drop the column `userId` on the `FridgeItem` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FridgeItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "expirationDate" DATETIME
);
INSERT INTO "new_FridgeItem" ("expirationDate", "id", "name") SELECT "expirationDate", "id", "name" FROM "FridgeItem";
DROP TABLE "FridgeItem";
ALTER TABLE "new_FridgeItem" RENAME TO "FridgeItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
