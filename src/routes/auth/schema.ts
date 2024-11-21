import Joi from "joi";
import { validateEmailDomain } from "../../utils/lib";

export const authSchema = Joi.object({
    email: Joi.string().email().custom(validateEmailDomain),
    password: Joi.string()
});

export const emailSchema = Joi.object({
    email: Joi.string().email().custom(validateEmailDomain),
});

export interface Auth {
    email: string;
    password: string;
}


