import type { Request, Response, NextFunction } from "express";
import {config} from "../config.js";

export function middlewareLogResponse(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    res.on("finish", () => {
        const { statusCode } = res
        const { method, url } = req

        if (statusCode !== 200) {
            console.log(`[NON-OK] ${method} ${url} - Status: ${statusCode}`);
        }
    });

    next();
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    config.fileserverHits++
    next()
}
