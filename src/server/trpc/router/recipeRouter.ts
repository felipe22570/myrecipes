import { Recipe } from "@prisma/client";
import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const recipeRouter = router({
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        userEmail: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, userEmail, image, description } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      const recipe: Recipe = await ctx.prisma.recipe.create({
        data: {
          name,
          description,
          userId: user?.id || "",
          image,
        },
      });

      if (recipe) {
        return recipe;
      } else {
        return null;
      }
    }),

  getAllRecipesByUser: publicProcedure
    .input(
      z.object({
        userEmail: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userEmail } = input;

      const user = await ctx.prisma.user.findUnique({
        where: {
          email: userEmail,
        },
      });

      if (user) {
        const recipes = await ctx.prisma.recipe.findMany({
          where: {
            userId: user.id,
          },
        });

        if (recipes) {
          return recipes;
        }
      }

      return null;
    }),

  findRecipe: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { recipeId } = input;

      const recipe = await ctx.prisma.recipe.findUnique({
        where: {
          id: recipeId,
        },
        include: {
          ingredients: true,
          instructions: true,
        },
      });

      if (recipe) {
        return recipe;
      } else {
        return null;
      }
    }),
  findInstructions: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { recipeId } = input;

      const instructions = await ctx.prisma.instruction.findMany({
        where: {
          recipeId: recipeId,
        },
      });

      return instructions;
    }),
});
