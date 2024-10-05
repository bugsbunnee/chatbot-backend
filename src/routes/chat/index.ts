import express, { Request, Response } from 'express';
import _ from 'lodash';

import { Options, rateLimit } from 'express-rate-limit';
import { getChatMessageList, getLastChatMetadata, sendChatMessage, startConversation } from '@/utils/openai';

import { Chat } from '@/models/chat';
import { messageZodSchema } from '@/models/chat/schema';

import auth from '@/middleware/auth';
import validateWith from '@/middleware/validateWith';

const router = express.Router();
const limitOptions: Partial<Options> = { windowMs: 15 * 60 * 1000, limit: 5, message: 'Too many requests, please try again later'};

router.post('/initialize', [auth, rateLimit(limitOptions)], async (req: Request, res: Response): Promise<any> => {
    let chat = await Chat.findOne({ userId: req.user?._id });
    if (chat) return res.json(_.pick(chat, ['_id']));

    const conversation = await startConversation();
    if (!conversation) return res.status(500).json({ message: 'Failed to initialize conversation' });

    chat = new Chat({
        userId: req.user?._id,
        assistantId: conversation.assistantId,
        threadId: conversation.threadId,
    });

    await chat.save();

    res.json(_.pick(chat, ['_id']));
});

router.post('/ask', [auth, validateWith(messageZodSchema)], async (req: Request, res: Response): Promise<any> =>  {
    const chat = await Chat.findOne({ userId: req.user?._id });
    if (!chat) return res.status(404).json({ message: 'No chat found for the given user!' });
    
    const options = {
        threadId: chat.threadId,
        assistantId: chat.assistantId,
        message: req.body.message,
    };

    const message = await sendChatMessage(options);
    if (!message) return res.status(500).json({ message: 'Failed to send the message' });

    chat.runId = message.runId;
    await chat.save();

    res.json({ message: req.body.message });
});

router.get('/', [auth], async (req: Request, res: Response): Promise<any> => {
    const chat = await Chat.findOne({ userId: req.user?._id });
    if (!chat) return res.status(404).json({ message: 'No chat found for the given user!' });

    const response = await getChatMessageList(_.pick(chat, ['threadId', 'runId']));

    return res.json({ 
        status: response.status,
        list: response.list,
        lastChat: getLastChatMetadata(response.list),
    });
});

export default router;