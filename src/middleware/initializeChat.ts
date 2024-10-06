import _ from "lodash";
import { NextFunction, Request, Response } from "express";

import { Chat } from "../models/chat";
import { startConversation } from "../utils/openai";

async function initializeChat(req: Request, res: Response, next: NextFunction) {
    let chat = await Chat.findOne({ userId: req.user?._id });

    if (!chat) {
        const conversation = await startConversation();
        if (!conversation) return res.status(500).json({ message: 'Failed to initialize conversation' });

        chat = new Chat({
            userId: req.user?._id,
            assistantId: conversation.assistantId,
            threadId: conversation.threadId,
        });
  
        await chat.save();
    } 

    req.chat = chat;

    next();
}

export default initializeChat;