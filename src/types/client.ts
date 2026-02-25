import type { ClientRow } from "@/server/db/schema"
export type Client = ClientRow
export type ClientType = Client["type"]
export type ClientStatus = Client["status"]
export type ClientFormState = Partial<Omit<Client, "id" | "createdAt" | "updatedAt">> & {
  password?: string
}