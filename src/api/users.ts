import type {Request, Response} from "express";
import {createUser} from "../db/queries/users.js";
import { respondWithJSON } from "./json.js";
import {BadRequestError} from "./errors.js";
import { NewUser } from "../db/schema.js";
import { hashPassword } from "../auth.js";

export type UserResponse = Omit<NewUser, "hashed_password">

export async function handlerUsersCreate(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
    }
    const params: parameters = req.body

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields")
    }

    const hashedPassword = await hashPassword(params.password);
    const user = await createUser({ hashedPassword, email: params.email  })

    if (!user) {
        throw new Error("Could not create user");
    }

    const {hashedPassword: _, ...userData} = user

    return respondWithJSON(res, 201, userData satisfies UserResponse);
}
