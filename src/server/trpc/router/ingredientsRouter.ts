import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const ingredientsRouter = router({
  findIngredients: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { recipeId } = input;

      const ingredients = await ctx.prisma.ingredient.findMany({
        where: {
          recipeId: recipeId,
        },
      });

      return ingredients;
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        recipeId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, recipeId } = input;

      const ingredient = await ctx.prisma.ingredient.create({
        data: {
          name,
          recipeId,
        },
      });

      if (ingredient) {
        return ingredient;
      } else {
        return null;
      }
    }),

  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      await ctx.prisma.ingredient.delete({
        where: {
          id: id,
        },
      });
    }),
});
