-- AlterTable
ALTER TABLE "Recipe" ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "recipeId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "isUser" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
