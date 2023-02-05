import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const groceryListRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.groceryListItem.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        sortOrder: "desc",
      },
    });
  }),
  add: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const groceryListCount = await ctx.prisma.groceryListItem.count({
        where: {
          userId: ctx.session.user.id,
          completed: false,
        },
      });

      return ctx.prisma.groceryListItem.create({
        data: {
          name: input.name,
          sortOrder: groceryListCount + 1,
          userId: ctx.session.user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const foundGroceryListItem =
        await ctx.prisma.groceryListItem.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });

      if (foundGroceryListItem.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this grocery list item.",
        });
      }

      return ctx.prisma.groceryListItem.update({
        data: {
          name: input.name,
          completed: input.completed,
        },
        where: {
          id: input.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const foundGroceryListItem =
        await ctx.prisma.groceryListItem.findUniqueOrThrow({
          where: {
            id: input.id,
          },
        });

      if (foundGroceryListItem.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this grocery list item.",
        });
      }

      return ctx.prisma.groceryListItem.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
