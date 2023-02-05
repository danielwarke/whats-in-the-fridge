ALTER TABLE "FridgeItem" RENAME CONSTRAINT "FridgeItem_userId_fkey" TO "FoodItem_userId_fkey";
ALTER TABLE IF EXISTS "FridgeItem" RENAME TO "FoodItem";