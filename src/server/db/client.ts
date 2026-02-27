import { drizzle } from "drizzle-orm/postgres-js"
import { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"
import { auth } from "@clerk/nextjs/server"
import { sql } from "drizzle-orm"

const connection = postgres(process.env.DATABASE_URL!, {
    prepare: false,
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
})

export type Database = PostgresJsDatabase<typeof schema>

export const db: Database = drizzle(connection, { schema })

export async function withSecureDb<T>(
    fn: (db: Database) => Promise<T>
): Promise<T> {
    const { userId } = await auth()
    if (!userId) throw new Error("Unauthorized")

    return await db.transaction(async (tx) => {
        await tx.execute(
            sql`SELECT set_config('app.current_user_id', ${userId}, true)`
        )
        return fn(tx as Database)
    })
}