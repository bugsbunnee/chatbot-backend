import { AuthUser } from "@/models/user/schema";
import { NextFunction, Request, Response } from "express";

import jwt from 'jsonwebtoken';

function auth(req: Request, res: Response, next: NextFunction): any {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded as unknown as AuthUser;

        next();
    } catch (error) {
        res.status(500).json({ message: 'Invalid token' });
    }
}

export default auth;