import { prisma } from "@/lib/db"
import axios from "axios";
import { NextApiRequest } from "next";

const DUMMY_USER_ID = 1;

interface Recipe {
    instructions: string[]
    prepTime: string
    cookTime: string
    cuisine: string[]
  }

interface RecipeData {
    [key: string]: Recipe
  }

export const POST = async(req: Request) => {
    try {
        const {prompt, userId} = await req.json();
        const finalUserId = userId || DUMMY_USER_ID;

        const wrapperPromt = 'You are a world class chef and you need to give some easy and quick detailed recipe for end user based on given ingredients in detailed instructions, give 6 recipes and output should be in a object format directly like {RecipeName:{instructions:["1.","2.",....],cookTime:,prepTime:,cuisine:[]}} with Each Recipe should be a key and in the object add recipe instruction, reipe time and any cuisuine tag for the recipe is any. Here are the indredents : '
        
        if(!prompt){
            return Response.json({ message: 'Prompt is missing' })
        }

        const user = await prisma.user.findFirst({
            where:{ 
                id: finalUserId
            }
        })
        if(!user){
            return Response.json({error:"User does not exist"})
        }

        const getPromptRes = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API}`,{  
            "contents": [{
              "parts":[{"text": wrapperPromt+prompt}]
            }]
        });
        
        if(!getPromptRes){
            return Response.json({message:"Something went wrong"})
        }

        console.log("AI Response:", getPromptRes.data);

        const recipe = getPromptRes.data["candidates"][0]["content"]["parts"][0]["text"]
        const newRecipe: RecipeData = JSON.parse(recipe.trim().slice(7).slice(0,-4))
        
        console.log("Parsed Recipe Data:", newRecipe);

        try {
            const result = await prisma.$transaction(async (tx) => {
                // Step 1: Create Recipes entry
                const addRecipe = await tx.recipes.create({
                    data: {
                        userId: finalUserId,
                        prompt: prompt,
                    },
                });
                console.log("Step 1 - Recipes created:", addRecipe);

                // Step 2: Create individual Recipe entries
                const individualRecipeData = Object.entries(newRecipe).map(([name, recipe]) => {
                    console.log("Processing recipe:", name, recipe);
                    return {
                        title: name,
                        prepTime: String(recipe.prepTime),
                        cookTime: String(recipe.cookTime),
                        instructions: recipe.instructions,
                        cuisine: JSON.stringify(recipe.cuisine),
                        recipesId: addRecipe.id
                    }
                });

                console.log("Step 2 - Recipe data prepared:", individualRecipeData);

                const individualRecipes = await tx.recipe.createMany({
                    data: individualRecipeData,
                });
                console.log("Step 2 - Individual Recipes created:", individualRecipes);

                // Step 3: Create Prompt entry
                const addPrompt = await tx.prompt.create({
                    data: {
                        text: prompt,
                        userId: finalUserId,
                        recipeId: addRecipe.id,
                    },
                });
                console.log("Step 3 - Prompt created:", addPrompt);

                // Step 4: Create API Response log
                const createLogs = await tx.apiResponse.create({
                    data: {
                        promptId: addPrompt.id,
                        response: recipe,
                    },
                });
                console.log("Step 4 - Logs created:", createLogs);

                return {
                    addRecipe,
                    individualRecipes,
                    addPrompt,
                    createLogs,
                };
            }, {
                maxWait: 15000,
                timeout: 30000,
            });

            console.log("Transaction completed successfully:", result);
            return Response.json(result);

        } catch (txError: any) {
            console.error("Transaction Error:", {
                message: txError.message,
                code: txError.code,
                meta: txError.meta,
                stack: txError.stack
            });
            
            return Response.json({ 
                error: "Transaction failed", 
                details: txError.message,
                code: txError.code,
                meta: txError.meta
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error("General Error:", error);
        return Response.json({ 
            error: "Failed to process request",
            details: error.message 
        }, { status: 500 });
    }
};


export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    console.log(searchParams)
    const recipesId = searchParams.get("recipesId");
  
    if (!recipesId) {
      return Response.json({ error: "Recipe ID is required" });
    }
  
    const getRecipe = await prisma.recipe.findMany({
      where: { recipesId: Number(recipesId) },
    });
  
    console.log(getRecipe)
    return Response.json(getRecipe);
};
  

