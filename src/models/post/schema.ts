import { z } from "zod";
import { PLATFORM_LIMITS, platforms } from "../../utils/constants";

import mongoose from "mongoose";
import moment from "moment";

export interface IPost {
    _id: mongoose.Types.ObjectId;
    platform: string;
    content: string;
    media: string;
    user: mongoose.Types.ObjectId;
    scheduleTime: Date;
    likes: number;
    shares: number;
    views: number;
    status: 'pending' | 'approved' | 'rejected' | 'published';
    approver?: mongoose.Types.ObjectId;
}

export const postZodSchema = z.object({
        platform: z.enum(platforms as any),
        content: z.string(),
        media: z.string().url(),
        useAI: z.boolean().default(false).optional(),
        scheduleTime: z.coerce.date().refine((datetime) => moment(datetime).isSame(moment()) || moment(datetime).isAfter(moment())),
    }).refine((data) => data.content.length < PLATFORM_LIMITS[data.platform as keyof typeof PLATFORM_LIMITS].charLimit, {
        message: 'Post content is too long!',
        path: ['content'],
    });

export type NewPost = z.infer<typeof postZodSchema>;

