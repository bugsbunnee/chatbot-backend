
import { z } from 'zod';

export const documentSchema = z.object({
    url: z.string().url(),
    fileName: z.string().min(3, 'File name must be at least 3 characters')
});

export const documentQuestionSchema = z.object({
    question: z.string().min(5, 'Question must be at least 5 characters'),
})

export type DocumentData = z.infer<typeof documentSchema>;


