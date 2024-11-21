import Joi from "joi";
import { ROLES } from "../../utils/constants";
import { validateEmailDomain } from "../../utils/lib";
import { Types } from "mongoose";

export const userJoiSchema = Joi.object({
    role: Joi.string().valid(ROLES.ADMIN, ROLES.EDITOR),
    firstName: Joi.string().min(3).required().label("First Name"),
    lastName: Joi.string().min(3).required().label("Last Name"),
    email: Joi.string().email().custom(validateEmailDomain),
    password: Joi.string()
                .min(8)
                .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!()-_=+]{8,}$'))
                .required()
                .label('Password'),
});

export interface IUser {
    role: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IUserMethods {
    generateAuthToken: () => string;
}

export interface IUserVirtuals {
    fullName: string;
}

export interface AuthUser { 
    _id: Types.ObjectId;
    role: IUser['role'];
}