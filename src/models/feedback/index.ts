import mongoose from "mongoose";
import { IFeedback } from "./schema";

const feedbackSchema = new mongoose.Schema<IFeedback>({
    subject: { type: String, required: true, minlength: 3, trim: true },
    message: { type: String, required: true, minlength: 10, trim: true },
}, { timestamps: true });

export const Feedback = mongoose.model<IFeedback>('Feedback', feedbackSchema);
