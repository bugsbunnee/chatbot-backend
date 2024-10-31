import OpenAI from 'openai';
import _ from 'lodash';
import logger from '../startup/logger';
import fs from 'fs';

import { Uploadable } from 'openai/uploads';

interface ConversationData { 
    vectorId: string | null;
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

export const generatePrompt = () => {
    return `
        Analyse the content in the files and provide a suitable answer
    `;
};

export const startConversation = async (): Promise<Omit<ConversationData, 'message' | 'vectorId'> | null> => {
    try {
        const assistant = await client.beta.assistants.create({ 
            name: 'RusselSmith Chat Assistant',
            instructions: 'You\'re RusselSmiths ChatBot called Dan, respond politely and be as informative as possible',
            model: process.env.OPEN_AI_MODEL as string,
            tools: [{ type: "file_search" }]
        });
    
        const thread = await client.beta.threads.create();
    
        return { assistantId: assistant.id, threadId: thread.id };
    } catch (error) {
        logger.error(error);

        return null;
    }
};

export const uploadFilesAndPoll = async (vectorName: string, fileStreams: Uploadable[]) => {
    let vectorStore = await client.beta.vectorStores.create({
        name: vectorName,
    });

    try {
        await client.beta.vectorStores.fileBatches.uploadAndPoll(vectorStore.id, { files: fileStreams });
        console.log('completed')
    } catch (error) {
        logger.error(error);
    }

    return vectorStore.id;
};

export const deleteFiles = async () => {
    const response = await client.files.list();

    for (const file of response.data) {
        await client.files.del(file.id);
    }
};

export const sendChatMessage = async (conversation: ConversationData): Promise<MessageData | null> => {
    try {
        if (conversation.vectorId) {
            await client.beta.assistants.update(conversation.assistantId, {
                tool_resources: { file_search: { vector_store_ids: [conversation.vectorId] } },
            });
        }

        const message = await client.beta.threads.messages.create(conversation.threadId, {
            role: 'user',
            content: conversation.message
        });
    
        const run = await client.beta.threads.runs.create(conversation.threadId, {
            assistant_id: conversation.assistantId,
            instructions: generatePrompt(),
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
