import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

const containerEnum = z.enum(["fridge", "pantry"]);

export const foodRouter = createTRPCRouter({
  listItems: protectedProcedure
    .input(
      z.object({
        container: containerEnum,
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.foodItem.findMany({
        where: {
          userId: ctx.session.user.id,
          container: input.container,
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
        container: containerEnum,
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.foodItem.create({
        data: {
          name: input.name,
          expirationDate: input.expirationDate,
          container: input.container,
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
        container: containerEnum,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const foundItem = await ctx.prisma.foodItem.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      if (foundItem.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this item.",
        });
      }

      return ctx.prisma.foodItem.update({
        data: {
          name: input.name,
          expirationDate: input.expirationDate,
          container: input.container,
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
      const foundItem = await ctx.prisma.foodItem.findUniqueOrThrow({
        where: {
          id: input.id,
        },
      });

      if (foundItem.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this item.",
        });
      }

      return ctx.prisma.foodItem.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
