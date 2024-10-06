import { app_roles } from "../../utils/constants";
import { Types } from "mongoose";
import { z } from "zod";

export const userZodSchema = z.object({
    role: z.enum(app_roles as any),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email().refine((value) => value.split('@')[1].indexOf('russelsmithgroup.com') !== -1, {
        message: 'Domain must be a russelsmith domain!'
    }),
    password: z.string()
                .min(8, { message: "Password must be at least 8 characters long." })
                .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter." })
                .regex(/[a-z]/, { message: "Password must include at least one lowercase letter." })
                .regex(/[0-9]/, { message: "Password must include at least one digit." })
                .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must include at least one special character." }),
});

export type IUser = z.infer<typeof userZodSchema>;

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