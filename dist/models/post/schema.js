"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postZodSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("../../utils/constants");
const mongoose_1 = __importDefault(require("mongoose"));
const moment_1 = __importDefault(require("moment"));
exports.postZodSchema = zod_1.z.object({
    platform: zod_1.z.enum(constants_1.platforms),
    content: zod_1.z.string(),
    media: zod_1.z.string().url(),
    user: zod_1.z.string().refine((userId) => mongoose_1.default.Types.ObjectId.isValid(userId)),
    useAI: zod_1.z.boolean().default(false).optional(),
    scheduleTime: zod_1.z.date().min((0, moment_1.default)().toDate())
}).refine((data) => data.content.length > constants_1.PLATFORM_LIMITS[data.platform].charLimit, {
    message: 'Post content is too long!',
    path: ['content'],
});
