/*
  Warnings:

  - You are about to drop the column `data` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Prompt" DROP CONSTRAINT "Prompt_recipeId_fkey";

-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_userId_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "data",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "cookTime" TEXT,
ADD COLUMN     "cuisine" TEXT,
ADD COLUMN     "ingredients" JSONB,
ADD COLUMN     "instructions" JSONB,
ADD COLUMN     "prepTime" TEXT,
ADD COLUMN     "recipesId" INTEGER,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Untitled Recipe';

-- CreateTable
CREATE TABLE "Recipes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Prompt" ADD CONSTRAINT "Prompt_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipes" ADD CONSTRAINT "Recipes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_recipesId_fkey" FOREIGN KEY ("recipesId") REFERENCES "Recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
