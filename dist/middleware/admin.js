"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
function admin(req, res, next) {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== constants_1.ROLES.ADMIN)
        return res.status(403).send({ message: 'Access denied.' });
    next();
}
exports.default = admin;
