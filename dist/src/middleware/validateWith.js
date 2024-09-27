"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validateWith(schema) {
    return function (req, res, next) {
        const validation = schema.safeParse(req.body);
        if (!validation.success)
            return res.status(400).json(validation.error.flatten());
        next();
    };
}
exports.default = validateWith;
