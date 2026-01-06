import {asc, eq} from "drizzle-orm";
import {NewChirp, chirps} from "../schema.js";
import {db} from "../index.js";

export async function createChirp(chirp: NewChirp) : Promise<NewChirp> {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();

    return result;
}

export async function getAllChirps() {
    return db
        .select()
        .from(chirps)
        .orderBy(asc(chirps.createdAt));
}

export async function getChirpById(id: string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result;
}

export async function deleteChirpById(id: string) {
    const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning();
    return rows.length > 0;
}