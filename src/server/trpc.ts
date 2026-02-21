import { initTRPC } from "@trpc/server"
import { auth } from "@clerk/nextjs/server"
import { ZodError } from "zod"
import { db } from "@/server/db/client"  // 👈 add this

export const createTRPCContext = async () => {
  const { userId } = await auth()
  return {
    userId,
    db,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error("UNAUTHORIZED")
  }
  return next({ ctx: { userId: ctx.userId } })
})