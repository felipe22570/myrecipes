// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./userRouter";
import { recipeRouter } from "./recipeRouter";
import { ingredientsRouter } from "./ingredientsRouter";
import { instructionsRouter } from "./instructionsRouter";

export const appRouter = router({
  auth: authRouter,
  userRouter: userRouter,
  recipeRouter: recipeRouter,
  ingredientsRouter: ingredientsRouter,
  instrucionsRouter: instructionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
