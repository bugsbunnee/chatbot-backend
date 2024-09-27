"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const constants_1 = require("../../utils/constants");
const PostSchema = new mongoose_1.default.Schema({
    platform: { type: String, enum: constants_1.platforms, required: true },
    content: { type: String, required: true },
    media: { type: String },
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    scheduleTime: { type: Date },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'published'], default: 'pending' },
    approver: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
});
exports.Post = mongoose_1.default.model('Post', PostSchema);
