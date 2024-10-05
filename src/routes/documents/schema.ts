
import { z } from 'zod';

export const newDocumentSchema = z.object({
    url: z.string().url(),
    type: z.literal('pdf'),
    documentNumber: z.string().min(3, 'Document number must be at least 3 characters'),
    name: z.string().min(3, 'File name must be at least 3 characters'),
    tags: z.array(z.string().min(1)).min(1)
});

export const updateDocumentSchema = z.object({
    url: z.string().url(),
});

export const documentQuestionSchema = z.object({
    question: z.string().min(5, 'Question must be at least 5 characters'),
})

export type NewDocumentData = z.infer<typeof newDocumentSchema>;


