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
const lodash_1 = __importDefault(require("lodash"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const admin_1 = __importDefault(require("../../middleware/admin"));
const validateObjectId_1 = __importDefault(require("../../middleware/validateObjectId"));
const openai_1 = require("../../utils/openai");
const post_1 = require("../../models/post");
const schedule_1 = require("../../utils/schedule");
const lib_1 = require("../../utils/lib");
const schema_1 = require("../../models/post/schema");
const validateWith_1 = __importDefault(require("../../middleware/validateWith"));
const router = express_1.default.Router();
router.post('/approve/:postId', [auth_1.default, admin_1.default, validateObjectId_1.default], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const post = yield post_1.Post.findById(req.params.postId);
    if (!post)
        return res.status(404).json({ message: 'Post not found' });
    post.status = 'approved';
    post.approver = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    yield post.save();
    yield (0, schedule_1.schedulePost)(post);
    res.json(lodash_1.default.pick(post, ['status', '_id']));
}));
router.post('/', [auth_1.default, (0, validateWith_1.default)(schema_1.postZodSchema)], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let content = req.body.content;
    if (req.body.useAI) {
        content = yield (0, openai_1.createCompletion)(req.body.platform, req.body.content);
    }
    const post = new post_1.Post({
        content,
        platform: req.body.platform,
        media: req.body.media,
        scheduleTime: req.body.scheduleTime,
        user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        status: 'pending'
    });
    yield post.save();
    res.status(201).json(lodash_1.default.pick(post, ['_id']));
}));
router.get('/', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { currentPage, limit, startIndex, total, pages } = yield (0, lib_1.calculatePaginationData)(req, post_1.Post);
    const posts = yield post_1.Post.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id })
        .skip(startIndex)
        .limit(limit);
    res.send({ posts, total, pages, currentPage, limit });
}));
exports.default = router;
