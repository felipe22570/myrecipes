import { z } from "zod";
import { router, publicProcedure } from "../trpc";

export const instructionsRouter = router({
  findInstructions: publicProcedure
    .input(
      z.object({
        recipeId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { recipeId } = input;

      const ingredients = await ctx.prisma.instruction.findMany({
        where: {
          recipeId: recipeId,
        },
      });

      return ingredients;
    }),
  create: publicProcedure
    .input(
      z.object({
        step: z.string(),
        recipeId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { step, recipeId } = input;

      const ingredient = await ctx.prisma.instruction.create({
        data: {
          step,
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
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id } = input;

      await ctx.prisma.instruction.delete({
        where: {
          id: id,
        },
      });
    }),
});
