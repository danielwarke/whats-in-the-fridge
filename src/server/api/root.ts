import { createTRPCRouter } from "./trpc";
import { foodRouter } from "./routers/fridge";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  food: foodRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
