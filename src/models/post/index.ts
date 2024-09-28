import mongoose from "mongoose";

import { IPost } from "./schema";
import { platforms } from "../../utils/constants";

const PostSchema = new mongoose.Schema<IPost>({
    platform: { type: String, enum: platforms,  required: true },
    content: { type: String, required: true },
    media: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduleTime: { type: Date },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'published'], default: 'pending' },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

PostSchema.index({ content: 'text' });

export const Post = mongoose.model('Post', PostSchema);
