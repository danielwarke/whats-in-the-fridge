import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  emoji: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        emoji: true,
      },
    });
  }),
  setEmoji: protectedProcedure
    .input(
      z.object({
        emoji: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        data: {
          emoji: input.emoji,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
