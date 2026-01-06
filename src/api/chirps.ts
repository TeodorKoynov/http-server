import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import {BadRequestError, NotFoundError} from "./errors.js";
import {createChirp, getAllChirps, getChirpById} from "../db/queries/chirps.js";

const BANNED_WORDS = ['kerfuffle', 'sharbert', 'fornax']
const REPLACEMENT_WORD = "****"

export async function handlerChirpsCreate(req: Request, res: Response) {
    type parameters = {
        userId: string;
        body: string;
    }
    const params: parameters = req.body

    if (!params.body || !params.userId) {
        throw new BadRequestError("Missing required fields")
    }
    const cleanBody = validateChirp(params.body)
    const chirp = await createChirp({ body: cleanBody, userId: params.userId })

    if (!chirp) {
        throw new Error("Could not create chirp");
    }

    return respondWithJSON(res, 201, chirp);
}

function validateChirp(body: string) {
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }

    return getCleanedBody(body);
}

function getCleanedBody(body: string) {
    const words = body.split(" ");

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const loweredWord = word.toLowerCase();
        if (BANNED_WORDS.includes(loweredWord)) {
            words[i] = REPLACEMENT_WORD;
        }
    }

    const cleanedBody = words.join(" ");
    return cleanedBody;
}

export async function handlerChirpsGet(_req: Request, res: Response) {
    const chirps = await getAllChirps();
    return respondWithJSON(res, 200, chirps);
}

export async function handlerChirpGet(req: Request, res: Response) {
    const { chirpId } = req.params;

    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    return respondWithJSON(res, 200, chirp);
}
