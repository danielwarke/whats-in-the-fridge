import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  preferences: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        emoji: true,
        notificationsEnabled: true,
      },
    });
  }),
  setPreferences: protectedProcedure
    .input(
      z.object({
        emoji: z.string().optional(),
        notificationsEnabled: z.boolean().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        data: {
          ...(typeof input.emoji !== "undefined" && { emoji: input.emoji }),
          ...(typeof input.notificationsEnabled !== "undefined" && {
            notificationsEnabled: input.notificationsEnabled,
          }),
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    }),
});
