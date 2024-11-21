import { Role } from "../utils/constants";
import { NextFunction, Request, Response } from "express";

function admin(req: Request, res: Response, next: NextFunction): any {
    if (req.user?.role !== Role.ADMIN) return res.status(403).send({ message: 'Access denied.' });

    next();
}

export default admin;