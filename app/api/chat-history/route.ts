import { prisma } from "@/lib/db"
import axios from "axios";

export const GET = async(req:Request) => {
    const { searchParams } = new URL(req.url);
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
        return Response.json({ error: "Recipe ID is required" });
    }

    try {
        const chatHistory = await prisma.chat.findMany({
            where: {
                recipeId: parseInt(recipeId),
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        return Response.json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return Response.json({ error: "Failed to fetch chat history" }, { status: 500 });
    }
}
