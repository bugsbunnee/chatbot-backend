
import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const emailSchema = z.object({
    email: z.string().email().refine((value) => value.split('@')[1].indexOf('russelsmithgroup.com') !== -1, {
        message: 'Domain must be a russelsmith domain!'
    }),
});

export type Auth = z.infer<typeof authSchema>;


