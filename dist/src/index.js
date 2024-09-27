"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const config_1 = __importDefault(require("./startup/config"));
const routes_1 = __importDefault(require("./startup/routes"));
const db_1 = __importDefault(require("./startup/db"));
const logger_1 = __importDefault(require("./startup/logger"));
const app = (0, express_1.default)();
(0, config_1.default)();
(0, db_1.default)();
(0, routes_1.default)(app);
const port = process.env.PORT || 4000;
const server = app.listen(port, () => logger_1.default.info(`Listening on port: ${port}`));
exports.default = server;
