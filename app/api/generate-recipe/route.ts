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

export const POST=async(req:Request)=>{
    try {
        const {prompt, userId}= await req.json();

        const wrapperPromt='You are a world class chef and you need to give some easy and quick detailed recipe for end user based on given ingredients in detailed instructions, give 6 recipes and output should be in a object format directly like {RecipeName:{instructions:["1.","2.",....],cookTime:,prepTime:,cuisine:[]}} with Each Recipe should be a key and in the object add recipe instruction, reipe time and any cuisuine tag for the recipe is any. Here are the indredents : '
        
        if(!prompt){
            return Response.json({ message: 'Prompt is missing' })
        }

        const finalUserId = userId || DUMMY_USER_ID;

        const user=await prisma.user.findFirst({
            where:{ 
                id: finalUserId
            }
        })
        if(!user){
            return Response.json({error:"User does not exist"})
        }
        

        const getPromptRes= await  axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API}`,{  
            "contents": [{
              "parts":[{"text": wrapperPromt+prompt}]
              }]
             });
        
        if(!getPromptRes){
            return Response.json({messgae:"Something went wrong"})
        }

        console.log(getPromptRes.data)

        const recipe=getPromptRes.data["candidates"][0]["content"]["parts"][0]["text"]

        //console.log("recipe",recipe)
        const newRecipe:RecipeData = JSON.parse(recipe.trim().slice(7).slice(0,-4))
        console.log("newRecipe ",newRecipe)

      
        
        const result = await prisma.$transaction(async (tx) => {
            // Step 1: Create a new entry in the `Recipes` model
            const addRecipe = await tx.recipes.create({
              data: {
                userId: finalUserId, // User ID for the Recipes model
                prompt: prompt, // Prompt associated with this set of recipes
                
              },
            });
            console.log("Recipes created: ", addRecipe);
       
            const individualRecipeData = Object.entries(newRecipe).map(([name, recipe]) => ({
              title: name,
              prepTime: String(recipe.prepTime),
              cookTime: String(recipe.cookTime),
              instructions: recipe.instructions,
              cuisine: JSON.stringify(recipe.cuisine),
              recipesId: addRecipe.id
            }));


            // Step 3: Insert individual `Recipe` entries
            const individualRecipes = await tx.recipe.createMany({
              data: individualRecipeData,
            });
            console.log("Individual Recipes created: ", individualRecipes);
          
          
          
            // Step 2: Create a new entry in the `Prompt` model
            const addPrompt = await tx.prompt.create({
              data: {
                text: prompt, // User's input
                userId: finalUserId, // User ID for the Prompt model
                recipeId: addRecipe.id, // Associate with the first recipe in the Recipes set
              },
            });
            console.log("Prompt created: ", addPrompt);
          
            // Step 3: Log the API response
            const createLogs = await tx.apiResponse.create({
              data: {
                promptId: addPrompt.id, // Reference the created Prompt
                response: recipe, // Store the response data
              },
            });
            console.log("Logs created: ", createLogs);
          
            return {
              addRecipe,
              addPrompt,
              createLogs,
            };
          });
        
        return Response.json(result)
        
        

    } catch (error) {
        
        return Response.json({ error })
    }
  }


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
  

