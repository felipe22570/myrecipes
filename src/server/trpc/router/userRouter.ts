import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import bcryptjs from "bcryptjs";

export const userRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { name, email, password } = input;

      const passwordHashed = await bcryptjs.hash(password, 8);

      const user = ctx.prisma.user.create({
        data: {
          name: name,
          email: email,
          password: passwordHashed,
        },
      });

      return user;
    }),
  findUser: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { email, password } = input;

      try {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        const passwordHashed = user?.password || "";

        const verifyPassword = bcryptjs.compareSync(password, passwordHashed);

        if (!verifyPassword) {
          return null;
        }

        return user;
      } catch (error) {
        return null;
      }
    }),
});
