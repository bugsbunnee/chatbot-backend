import logger from '../startup/logger';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createCompletion = async (platform: string, content: string) => {
    try {
        const response = await client.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: `Write a social media post for ${platform} about: ${content}`}]
        });

        return response.choices[0].message.content;
    } catch (error) {
        logger.error(error);
        
        return content;
    }
}