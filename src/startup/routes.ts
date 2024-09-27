import cors from 'cors';
import helmet from "helmet";
import compression from 'compression';
import express, { Express } from "express";

import auth from '../routes/auth';
import posts from '../routes/posts';

import error from "../middleware/error";

function registerRoutes(app: Express) {
    app.use(cors());
    app.use(compression());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/v1/auth', auth);
    app.use('/api/vi/posts', posts);
    
    app.use(error);
}

export default registerRoutes;