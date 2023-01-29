import { createTRPCRouter } from "./trpc";
import { fridgeRouter } from "./routers/fridge";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  fridge: fridgeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
