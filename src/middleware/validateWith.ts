import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { z } from "zod";

function validateWith(schema: z.ZodObject<z.ZodRawShape>) {
    return function (req: Request, res: Response, next: NextFunction): any {
        const validation = schema.safeParse(req.body);
        if (!validation.success) return res.status(400).json(_.omit(validation.error.format(), ['_errors']));

        next();
    }
}

export default validateWith;