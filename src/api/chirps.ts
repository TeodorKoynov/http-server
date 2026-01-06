import type { Request, Response } from "express";

import { respondWithJSON, respondWithError } from "./json.js";

const BANNED_WORDS = ['kerfuffle', 'sharbert', 'fornax']
const REPLACEMENT_WORD = "****"

export async function handlerChirpsValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        respondWithError(res, 400, "Chirp is too long");
        return;
    }
    const words = params.body.split(" ");

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (BANNED_WORDS.includes(loweredWord)) {
            words[i] = REPLACEMENT_WORD;
        }
    }

    const cleanedBody = words.join(" ");

    respondWithJSON(res, 200, {
        cleanedBody,
    });
}
