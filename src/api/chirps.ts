import type { Request, Response } from "express";

import { respondWithJSON } from "./json.js";
import {BadRequestError, NotFoundError, UserForbiddenError, UserNotAuthenticatedError} from "./errors.js";
import {createChirp, deleteChirpById, getAllChirps, getChirpById} from "../db/queries/chirps.js";
import {getBearerToken, validateJWT} from "../auth.js";
import {config} from "../config.js";

const BANNED_WORDS = ['kerfuffle', 'sharbert', 'fornax']
const REPLACEMENT_WORD = "****"

export async function handlerChirpsCreate(req: Request, res: Response) {
    type parameters = {
        body: string;
    }
    const params: parameters = req.body

    if (!params.body) {
        throw new BadRequestError("Missing required fields")
    }

    const token = getBearerToken(req)
    const userId = validateJWT(token, config.jwt.secret)

    const cleanBody = validateChirp(params.body)
    const chirp = await createChirp({ userId, body: cleanBody })

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

export async function handlerChirpsGet(req: Request, res: Response) {
    let authorId: string | undefined;
    if (typeof req.query.authorId === "string") {
        authorId = req.query.authorId;
    }

    let sort: "asc" | "desc" = "asc";
    if (req.query.sort === "desc") {
        sort = "desc";
    }

    const chirps = await getAllChirps(authorId, sort);
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

export async function handlerChirpDelete(req: Request, res: Response) {
    const { chirpId } = req.params;

    const token = getBearerToken(req)
    const userId = validateJWT(token, config.jwt.secret)

    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError(`Chirp with chirpId: ${chirpId} not found`);
    }

    if (userId !== chirp.userId) {
        throw new UserForbiddenError("You can't delete this chirp");
    }

    const deleted = await deleteChirpById(chirp.id);
    if (!deleted) {
        throw new Error(`Failed to delete chirp with chirpId: ${chirpId}`);
    }

    res.status(204).send();
}
