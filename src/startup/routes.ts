import cors from 'cors';
import helmet from "helmet";
import compression from 'compression';
import express, { Express } from "express";

import auth from '../routes/auth';
import chat from '../routes/chat';
import documents from '../routes/documents';
import feedback from '../routes/feedback';

import error from "../middleware/error";

function registerRoutes(app: Express) {
    app.use(cors());
    app.use(compression());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/api/v1/auth', auth);
    app.use('/api/v1/chat', chat);
    app.use('/api/v1/documents', documents);
    app.use('/api/v1/feedback', feedback);
    
    app.use(error);
}

export default registerRoutes;