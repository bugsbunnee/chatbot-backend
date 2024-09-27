import { NextFunction, Request, Response } from "express";
import logger from "../startup/logger";

function error(error: Error, req: Request, res: Response, next: NextFunction) {
    logger.error(error.message);

    res.status(500).send(error.message);
}

export default error;