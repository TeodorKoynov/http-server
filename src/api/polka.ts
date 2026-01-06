import type { Request, Response } from "express";
import {NotFoundError, UserNotAuthenticatedError} from "./errors.js";
import { upgradeToChirpyRed } from "../db/queries/users.js";
import {getAPIKey} from "../auth.js";
import {config} from "../config.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

    const apiKey = getAPIKey(req)
    if (apiKey !== config.api.polkaApiKey) {
        throw new UserNotAuthenticatedError("Invalid API key");
    }

    const params: parameters = req.body;

    if (params.event !== "user.upgraded") {
        return res.status(204).send();
    }

    const user = await upgradeToChirpyRed(params.data.userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    res.status(204).send();
}
