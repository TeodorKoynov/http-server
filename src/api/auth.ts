import type {Request, Response} from "express";
import {BadRequestError, UserNotAuthenticatedError} from "./errors.js";
import {getUserByEmail} from "../db/queries/users.js";
import {checkPasswordHash, makeJWT} from "../auth.js";
import {respondWithJSON} from "./json.js";
import {UserResponse} from "./users.js";
import {config} from "../config.js";

type LoginResponse = UserResponse & {
    token: string;
};

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
        expiresIn?: number;
    }
    const params: parameters = req.body

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields")
    }

    const user = await getUserByEmail(params.email);
    if (!user) {
        throw new UserNotAuthenticatedError("Incorrect email or password")
    }

    const isMatch = await checkPasswordHash(params.password, user.hashedPassword)
    if (!isMatch) {
        throw new UserNotAuthenticatedError("Incorrect email or password")
    }
    const expiresIn = Math.min(params.expiresIn ?? config.jwt.defaultDuration, config.jwt.defaultDuration)
    const token = makeJWT(user.id, expiresIn, config.jwt.secret)

    const {hashedPassword: _,  ...userData} = user

    return respondWithJSON(res, 200, {...userData, token} satisfies LoginResponse);
}