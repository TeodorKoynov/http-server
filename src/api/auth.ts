import type {Request, Response} from "express";
import {BadRequestError, UserNotAuthenticatedError} from "./errors.js";
import {getUserByEmail} from "../db/queries/users.js";
import {checkPasswordHash} from "../auth.js";
import {respondWithJSON} from "./json.js";
import {UserResponse} from "./users.js";

export async function handlerLogin(req: Request, res: Response) {
    type parameters = {
        password: string;
        email: string;
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

    const {hashedPassword: _,  ...userData} = user

    return respondWithJSON(res, 200, userData satisfies UserResponse);
}