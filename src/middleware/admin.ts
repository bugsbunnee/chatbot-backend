import { ROLES } from "../utils/constants";
import { NextFunction, Request, Response } from "express";

function admin(req: Request, res: Response, next: NextFunction): any {
    if (req.user?.role !== ROLES.ADMIN) return res.status(403).send({ message: 'Access denied.' });

    next();
}

export default admin;