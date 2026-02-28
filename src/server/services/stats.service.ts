import { talent, clients, placements, projects } from "@/server/db/schema"
import { count, eq } from "drizzle-orm"
import { BaseService } from "./base.service"

export class StatsService extends BaseService {
    async getPublicStats() {
        const [
            [totalTalent],
            [vettedTalent],
            [totalClients],
            [totalPlacements],
            [totalProjects],
        ] = await Promise.all([
            this.db.select({ count: count() }).from(talent),
            this.db.select({ count: count() }).from(talent).where(eq(talent.isVetted, true)),
            this.db.select({ count: count() }).from(clients),
            this.db.select({ count: count() }).from(placements),
            this.db.select({ count: count() }).from(projects),
        ])

        return {
            talent: totalTalent?.count ?? 0,
            vetted: vettedTalent?.count ?? 0,
            clients: totalClients?.count ?? 0,
            placements: totalPlacements?.count ?? 0,
            projects: totalProjects?.count ?? 0,
        }
    }
}

export const statsService = new StatsService()