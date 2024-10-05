import { z } from "zod";

export const messageZodSchema = z.object({
    message: z.string().min(10, 'Message must be at least 10 characters')
});

export type MessageData = z.infer<typeof messageZodSchema>;