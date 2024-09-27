"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedulePost = void 0;
const post_1 = require("../models/post");
const bull_1 = __importDefault(require("bull"));
const moment_1 = __importDefault(require("moment"));
const postQueue = new bull_1.default('postQueue');
postQueue.process((job) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield post_1.Post.findById(job.data.postId);
    if (!post)
        return;
    post.status = 'published';
    yield post.save();
}));
const schedulePost = (post) => __awaiter(void 0, void 0, void 0, function* () {
    const delay = (0, moment_1.default)(post.scheduleTime).diff((0, moment_1.default)(), 'millisecond');
    yield postQueue.add({ postId: post._id }, { delay });
});
exports.schedulePost = schedulePost;
