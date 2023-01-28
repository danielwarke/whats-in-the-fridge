import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
  updateItem: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        expirationDate: z.date().min(new Date()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const foundItem = await ctx.prisma.fridgeItem.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!foundItem) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to find fridge item to update.",
        });
      }

      return ctx.prisma.fridgeItem.update({
        data: {
          name: input.name,
          expirationDate: input.expirationDate,
        },
        where: {
          id: input.id,
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
