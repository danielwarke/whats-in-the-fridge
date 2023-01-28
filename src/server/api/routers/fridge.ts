import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const fridgeRouter = createTRPCRouter({
  listItems: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fridgeItem.findMany({
      orderBy: {
        expirationDate: "asc",
      },
    });
  }),
  addItem: publicProcedure
    .input(
      z.object({
        name: z.string(),
        expirationDate: z.date().min(new Date()),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.fridgeItem.create({
        data: {
          name: input.name,
          expirationDate: input.expirationDate,
        },
      });
    }),
  deleteItem: publicProcedure
    .input(
      z.object({
        itemId: z.string(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.fridgeItem.delete({
        where: {
          id: input.itemId,
        },
      });
    }),
});
