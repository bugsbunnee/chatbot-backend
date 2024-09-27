"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../../utils/constants");
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: constants_1.app_roles, default: 'editor' }
});
UserSchema.method('generateAuthToken', function () {
    const token = jsonwebtoken_1.default.sign({ _id: this._id, role: this.role }, process.env.JWT_SECRET);
    return token;
});
UserSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});
exports.User = mongoose_1.default.model('User', UserSchema);
