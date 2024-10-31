import { NextFunction, Request, Response } from "express";

import Joi from "joi";
import _ from "lodash";

function validateWith(schema:Joi.ObjectSchema) {
    return function (req: Request, res: Response, next: NextFunction): any {
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        next();
    }
}

export default validateWith;