import { prisma } from "@/lib/db";
import axios from "axios";

export const POST = async (req: Request) => {
  try {
    const { message, recipeId } = await req.json();

    if (!message || !recipeId) {
      return Response.json({ error: "Message and recipeId are required" }, { status: 400 });
    }

    // Save user message
    const userMessage = await prisma.chat.create({
      data: {
        recipeId: parseInt(recipeId),
        message: message,
        isUser: true,
      },
    });

    // Get recipe context
    const recipe = await prisma.recipe.findFirst({
      where: { id: parseInt(recipeId) },
    });

    // Prepare AI prompt with recipe context
    const contextPrompt = `You are a helpful cooking assistant discussing the recipe "${recipe?.title}". 
    The user's message is: ${message}
    
    Provide specific cooking advice, modifications, or explanations about this recipe.`;

    // Get AI response
    const aiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API}`,
      {
        contents: [{
          parts: [{ text: contextPrompt }]
        }]
      }
    );

    const assistantResponse = aiResponse.data.candidates[0].content.parts[0].text;

    // Save AI response
    const savedAiResponse = await prisma.chat.create({
      data: {
        recipeId: parseInt(recipeId),
        message: assistantResponse,
        isUser: false,
      },
    });

    return Response.json([userMessage, savedAiResponse]);

  } catch (error) {
    console.error('Error in recipe chat:', error);
    return Response.json({ error: "Failed to process chat message" }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const recipeId = searchParams.get("recipeId");

  if (!recipeId) {
    return Response.json({ error: "Recipe ID is required" }, { status: 400 });
  }

  try {
    const chatHistory = await prisma.chat.findMany({
      where: {
        recipeId: parseInt(recipeId),
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return Response.json(chatHistory);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return Response.json({ error: "Failed to fetch chat history" }, { status: 500 });
  }
}; 