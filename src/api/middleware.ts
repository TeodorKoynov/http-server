import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { respondWithError } from "./json.js";
import { BadRequestError, NotFoundError, UserForbiddenError, UserNotAuthenticatedError } from "./errors";

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

export function errorMiddleWare(
    err: Error,
    _: Request,
    res: Response,
    __: NextFunction,
) {
    let statusCode = 500;
    let message = "Something went wrong on our end";

    if (err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }

    if (statusCode >= 500) {
        console.log(err.message);
    }

    respondWithError(res, statusCode, message);
}
