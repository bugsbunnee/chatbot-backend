import express, { Request, Response } from 'express';
import _ from 'lodash';

import { Options, rateLimit } from 'express-rate-limit';
import { getChatMessageList, getLastChatMetadata, sendChatMessage, startConversation } from '../../utils/openai';

import { Chat } from '../../models/chat';
import { messageZodSchema } from '../../models/chat/schema';

import auth from '../../middleware/auth';
import validateWith from '../../middleware/validateWith';
import initializeChat from '../../middleware/initializeChat';

const router = express.Router();
const limitOptions: Partial<Options> = { windowMs: 15 * 60 * 1000, limit: 5, message: 'Too many requests, please try again later'};

router.post('/initialize', [auth, rateLimit(limitOptions), initializeChat], async (req: Request, res: Response): Promise<any> => {
    res.json(_.pick(req.chat, ['_id']));
});

router.post('/ask', [auth, validateWith(messageZodSchema), initializeChat], async (req: Request, res: Response): Promise<any> =>  {
    if (!req.chat) return res.status(404).json({ message: 'No chat found for the given user!' });

    const options = {
        threadId: req.chat.threadId,
        assistantId: req.chat.assistantId,
        message: req.body.message,
    };

    const message = await sendChatMessage(options);
    if (!message) return res.status(500).json({ message: 'Failed to send the message' });

    await Chat.updateOne({ _id: req.chat._id }, { $set: { runId: message.runId }});

    res.json({ message: req.body.message });
});

router.get('/', [auth, initializeChat], async (req: Request, res: Response): Promise<any> => {
    if (!req.chat || !req.chat.runId) return res.status(404).json({ message: 'No chat found for the given user!' });

    const response = await getChatMessageList(_.pick(req.chat, ['threadId', 'runId']));

    return res.json({ 
        status: response.status,
        list: response.list,
        lastChat: getLastChatMetadata(response.list),
    });
});

export default router;