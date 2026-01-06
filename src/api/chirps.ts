import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import { BadRequestError } from "./errors.js";

const BANNED_WORDS = ['kerfuffle', 'sharbert', 'fornax']
const REPLACEMENT_WORD = "****"

export async function handlerChirpsValidate(req: Request, res: Response) {
    type parameters = {
        body: string;
    };

    const params: parameters = req.body;

    const maxChirpLength = 140;
    if (params.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
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
