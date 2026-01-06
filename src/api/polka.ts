import type { Request, Response } from "express";
import { NotFoundError } from "./errors.js";
import { upgradeToChirpyRed } from "../db/queries/users.js";

export async function handlerPolkaWebhook(req: Request, res: Response) {
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

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
