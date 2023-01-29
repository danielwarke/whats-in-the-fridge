import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const fridgeRouter = createTRPCRouter({
  listItems: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.fridgeItem.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        expirationDate: "asc",
      },
    });
  }),
  addItem: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        expirationDate: z.date(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.fridgeItem.create({
        data: {
          name: input.name,
          expirationDate: input.expirationDate,
          userId: ctx.session.user.id,
        },
      });
    }),
  updateItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        expirationDate: z.date(),
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

      if (foundItem.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this item.",
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
  deleteItem: protectedProcedure
    .input(
      z.object({
        id: z.string(),
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

      if (foundItem.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this item.",
        });
      }

      return ctx.prisma.fridgeItem.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
