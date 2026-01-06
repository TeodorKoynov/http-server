import type { Request, Response, NextFunction } from "express";

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
