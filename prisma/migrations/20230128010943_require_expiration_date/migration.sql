/*
  Warnings:

  - Made the column `expirationDate` on table `FridgeItem` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FridgeItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "expirationDate" DATETIME NOT NULL
);
INSERT INTO "new_FridgeItem" ("expirationDate", "id", "name") SELECT "expirationDate", "id", "name" FROM "FridgeItem";
DROP TABLE "FridgeItem";
ALTER TABLE "new_FridgeItem" RENAME TO "FridgeItem";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
