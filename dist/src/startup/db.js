"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
function registerDB() {
    mongoose_1.default.connect(process.env.DB_URL)
        .then(() => logger_1.default.info(`Connected to DB: ${process.env.DB_URL}`))
        .catch((error) => logger_1.default.error(error));
}
exports.default = registerDB;
