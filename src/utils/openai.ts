import OpenAI from 'openai';
import _ from 'lodash';
import logger from '../startup/logger';
import { readAllDocumentContent } from './lib';
import { MAX_CONTENT_LENGTH } from './constants';

interface ConversationData { 
    assistantId: string; 
    threadId: string;
    message: string; 
}

interface MessageData { 
    messageId: string; 
    runId: string;
}

interface MessageListResponse {
    status: OpenAI.Beta.Threads.Runs.RunStatus;
    list: Partial<OpenAI.Beta.Threads.Messages.Message>[]
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const createCompletion = async (platform: string, content: string) => {
    try {
        const response = await client.chat.completions.create({
            model: process.env.OPEN_AI_MODEL as string,
            messages: [{ role: 'user', content: `Write a social media post for ${platform} about: ${content}`}],
            temperature: 0.2,
            max_completion_tokens: 100
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
};

export const startConversation = async (): Promise<Omit<ConversationData, 'message'> | null> => {
    try {
        const assistant = await client.beta.assistants.create({ 
            name: 'RusselSmith Chat Assistant',
            instructions: 'You\'re RusselSmiths ChatBot called Dan, respond politely and be as informative as possible',
            model: process.env.OPEN_AI_MODEL as string,
        });
    
        const thread = await client.beta.threads.create();
    
        return { assistantId: assistant.id, threadId: thread.id };
    } catch (error) {
        logger.error(error);

        return null;
    }
};

export const sendChatMessage = async (conversation: ConversationData): Promise<MessageData | null> => {
    try {
        const allDocumentContent = await readAllDocumentContent();

        const message = await client.beta.threads.messages.create(conversation.threadId, {
            role: 'user',
            content: conversation.message
        });
    
        const run = await client.beta.threads.runs.create(conversation.threadId, {
            assistant_id: conversation.assistantId,
            instructions: generatePrompt(allDocumentContent.substring(0, MAX_CONTENT_LENGTH), conversation.message),
        });
    
        return { messageId: message.id, runId: run.id };
    } catch (error) {
        logger.error(error);
        
        return null;
    }
};

export const getChatMessageList = async (chat: { threadId: string; runId: string; }): Promise<MessageListResponse> => {
    try {
        const response = await client.beta.threads.runs.retrieve(chat.threadId, chat.runId);
        const status = response.status;
    
        if (response.status !== 'completed') return { status, list: []};
        
        const messages = await client.beta.threads.messages.list(chat.threadId);
        const list = messages.data.map((item) => _.pick(item, ['id', 'created_at', 'role', 'content[0].text.value']));

        return { status, list: _.orderBy(list, ['created_at'], ['asc']) };
    } catch (error) {
        logger.error(error);

        return { status: 'failed', list: [] }
    }
};

export const getLastChatMetadata = (chatMessages: MessageListResponse['list']) => {
    if (chatMessages.length === 0) return null;

    const lastMessage = _.orderBy(chatMessages, ['created_at'], ['desc'])[0];
    if (!lastMessage) return null;

    return {
        created_at: lastMessage.created_at,
        id: lastMessage.id,
        role: lastMessage.role,
        message: _.get(lastMessage, 'content[0].text.value')
    };
};