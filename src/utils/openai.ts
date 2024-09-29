import logger from '../startup/logger';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createCompletion = async (platform: string, content: string) => {
    try {
        const response = await client.chat.completions.create({
            model: process.env.OPEN_AI_MODEL as string,
            messages: [{ role: 'user', content: `Write a social media post for ${platform} about: ${content}`}]
        });

        return response.choices[0].message.content;
    } catch (error) {
        logger.error(error);
        
        return content;
    }
}

export const generatePrompt = (content: string, question: string) => {
    return `
        As a director in RusselSmith Group Nigeria, we have an employee guide and
        we are seeking to educate our employees on the guide.

        Here's the content in our employee handbook:
        
        ${content}

        -----

        Instructions for Task Completion:
        
        Analyse the content from the specified text in the handbook above and respond to
        any clarifications the user may ask.

        With the provided instructions above, respond to this question: ${question}
    `;
};

export const generateResponseToDocumentQuestion = async (content: string, question: string) => {
    try {
        const completion = await client.chat.completions.create({
            model: process.env.OPEN_AI_MODEL as string,
            messages: [
                { role: 'system', content: 'You are the Human Resource manager at RusselSmith Group Nigeria, willing to educate employees about company policy' },
                { role: 'user', content: generatePrompt(content, question) }
            ],
            temperature: 0.2,
            max_completion_tokens: 500,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        return '';
    }
}