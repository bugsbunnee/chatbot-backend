import mongoose from "mongoose";
import { IDocument, IDocumentEnquiry } from "./schema";

const enquirySchema = new mongoose.Schema<IDocumentEnquiry>({
    question: { type: String, required: true, trim: true, minlength: 5 },
    response: { type: String }
});

const documentSchema = new mongoose.Schema<IDocument>({
    fileName: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    enquiries: [enquirySchema]
});

export const Document = mongoose.model('Document', documentSchema);