"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../startup/logger"));
function error(error, req, res, next) {
    logger_1.default.error(error.message);
    res.status(500).json({ message: error.message });
}
exports.default = error;
