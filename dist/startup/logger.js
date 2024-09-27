"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
    defaultMeta: { service: 'user-service' },
    handleExceptions: true,
    transports: [
        new winston_1.default.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'combined.log' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    const consoleTransport = new winston_1.default.transports.Console({ format: winston_1.default.format.simple() });
    logger.add(consoleTransport);
}
process.on('unhandledRejection', (ex) => {
    throw ex;
});
exports.default = logger;
