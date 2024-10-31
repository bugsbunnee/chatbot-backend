import axios from 'axios';
import cron from 'node-cron';

import { Document } from '../models/document';
import { Chat } from '../models/chat';
import { uploadFilesAndPoll } from './openai';

export const updateAndPollDocuments = async () => {
    cron.schedule('* * * * *', async () => {
        const documents = await Document.find({ isAnalyzed: false });
        if (documents.length === 0) return;

        const fileStreamPromises = documents.map(async (document) => {
            const entry = document.getLastEntry();
            if (!entry) throw new Error('Entry not found!');

            const response = await axios.get(entry.url, { responseType: 'blob' });
            const file = new File([response.data], `${document.name}.${entry.type}`, { type: 'application/pdf' });

            return file;
        });

        const fileStreams = await Promise.all(fileStreamPromises);

        const vectorId = await uploadFilesAndPoll("Company Policies", fileStreams);
        if (!vectorId) return;

        await Document.updateMany({ _id: { $in: documents.map((document) => document._id) }}, { $set: { isAnalyzed: true }});
        await Chat.updateMany({ $set: { vectorId }});
    });
};
