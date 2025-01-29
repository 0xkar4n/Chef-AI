import { prisma } from "@/lib/db"
import axios from "axios";

export const GET = async(req:Request) => {
    const { searchParams } = new URL(req.url);
    console.log(searchParams)
    const recipeId = searchParams.get("recipeId");

    if (!recipeId) {
        return Response.json({ error: "Recipe ID is required" });
      }

    const getRecipeData=await prisma.recipe.findFirst({
        where:{
            id: parseInt(recipeId),
        }
    })

    console.log(getRecipeData)

    const wrapperPromt='Customer has some new request or customization for the one of the recipe based the request please update the recipe instructions and  output should be in a object format directly like {RecipeName:{instructions:["1.","2.",....],cookTime:,prepTime:,cuisine:[]}} with Each Recipe should be a key and in the object add recipe instruction, reipe time and any cuisuine tag for the recipe is any. Here are the new request : '
    
    return Response.json(wrapperPromt)


  

  

}
