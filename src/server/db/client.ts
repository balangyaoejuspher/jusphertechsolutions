import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { auth } from "@clerk/nextjs/server"

const globalForDb = globalThis as unknown as {
    connection: postgres.Sql | undefined
}

const connection =
    globalForDb.connection ??
    postgres(process.env.DATABASE_URL!, {
        prepare: false,
        max: 1,
        idle_timeout: 20,
        connect_timeout: 10,
    })

if (process.env.NODE_ENV !== "production") {
    globalForDb.connection = connection
}

export const db = drizzle(connection, { schema })

export async function getSecureDb() {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    await connection`SELECT set_config('app.current_user_id', ${userId}, true)`

    return db
}