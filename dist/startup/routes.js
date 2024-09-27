"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../routes/auth"));
const posts_1 = __importDefault(require("../routes/posts"));
const error_1 = __importDefault(require("../middleware/error"));
function registerRoutes(app) {
    app.use((0, cors_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use('/api/v1/auth', auth_1.default);
    app.use('/api/vi/posts', posts_1.default);
    app.use(error_1.default);
}
exports.default = registerRoutes;
