import mongoose from "mongoose";
import { IDocument, IDocumentHistory, IDocumentMethods } from "./schema";

type DocumentModel = mongoose.Model<IDocument, {}, IDocumentMethods>;

const HistorySchema = new mongoose.Schema<IDocumentHistory>({
    type: { type: String, enum: ['pdf'], required: true },
    version: { type: Number, min: 1, required: true }, 
    url: { type: String }
});

const DocumentSchema = new mongoose.Schema<IDocument, DocumentModel, IDocumentMethods>({
    isAnalyzed: { type: Boolean, default: false },
    lastInsertedVersion: { type: Number, min: 1, required: true },
    name: { type: String, required: true, trim: true },
    documentNumber: { type: String, unique: true, required: true },
    history: [HistorySchema],
    tags: [String],
}, {
    timestamps: true
});

DocumentSchema.methods.getLastEntry = function () {
    const latestHistory = this.history.find((item) => item.version === this.lastInsertedVersion);
    return latestHistory;
};

export const Document = mongoose.model('Document', DocumentSchema);
