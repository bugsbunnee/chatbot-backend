import mongoose from "mongoose";

interface IChat {
    userId: mongoose.Types.ObjectId;
    assistantId: string;
    threadId: string;
    runId: string;
}

const chatSchema = new mongoose.Schema<IChat>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assistantId: { type: String, required: true },
    threadId: { type: String, required: true },
    runId: { type: String }
}, { timestamps: true });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
