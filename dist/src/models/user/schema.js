"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userZodSchema = void 0;
const constants_1 = require("../../utils/constants");
const zod_1 = require("zod");
exports.userZodSchema = zod_1.z.object({
    role: zod_1.z.enum(constants_1.app_roles),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Password must include at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Password must include at least one digit." })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must include at least one special character." }),
});
