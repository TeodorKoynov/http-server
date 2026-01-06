import type { Request, Response } from "express";
import { config } from "../config";

export async function handlerReset(req: Request, res: Response) {
    config.fileserverHits = 0;
    res.send()
}
