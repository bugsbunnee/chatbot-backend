import { z } from "zod";

export const feedbackZodSchema = z.object({
    subject: z.string().min(3, 'Subject must be at least 3 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters')
});

export type IFeedback = z.infer<typeof feedbackZodSchema>;