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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const lodash_1 = __importDefault(require("lodash"));
const validateWith_1 = __importDefault(require("../../middleware/validateWith"));
const schema_1 = require("./schema");
const user_1 = require("../../models/user");
const schema_2 = require("../../models/user/schema");
const router = express_1.default.Router();
router.post('/login', (0, validateWith_1.default)(schema_1.authSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send({ message: 'User not found' });
    const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send({ message: 'Invalid password' });
    const token = user.generateAuthToken();
    res.send({ token });
}));
router.post('/register', (0, validateWith_1.default)(schema_2.userZodSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send({ message: 'User already exists' });
    user = new user_1.User(lodash_1.default.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'role']));
    const salt = yield bcrypt_1.default.genSalt(10);
    user.password = yield bcrypt_1.default.hash(user.password, salt);
    yield user.save();
    res
        .header('x-auth-token', user.generateAuthToken())
        .header('access-control-expose-headers', 'x-auth-token')
        .status(201).send(lodash_1.default.omit(user, ['password']));
}));
exports.default = router;
