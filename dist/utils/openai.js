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
exports.createCompletion = void 0;
const openai_1 = __importDefault(require("openai"));
const client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const createCompletion = (platform, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield client.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [{ role: 'user', content: `Write a social media post for ${platform} about: ${content}` }]
        });
        return response.choices[0].message.content;
    }
    catch (error) {
        return '';
    }
});
exports.createCompletion = createCompletion;
