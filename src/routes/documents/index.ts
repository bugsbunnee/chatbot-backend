import express, { Request, Response } from 'express';
import axios from 'axios';
import _ from 'lodash';

import admin from '../../middleware/admin';
import auth from '../../middleware/auth';
import validateWith from '../../middleware/validateWith';
import validateObjectId from '../../middleware/validateObjectId';

import { documentQuestionSchema, documentSchema } from './schema';
import { Document } from '../../models/document';
import { generateResponseToDocumentQuestion } from '../../utils/openai';

const router = express.Router();

router.post('/', [auth, admin, validateWith(documentSchema)], async (req: Request, res: Response): Promise<any> => {
    const response = await axios.get(req.body.url, { responseType: 'text' });

    const document = new Document({
        fileName: req.body.fileName,
        content: response.data,
        enquiries: []
    });

    await document.save();

    res.status(201).json(document);
});

router.post('/:id/enquire', [auth, validateObjectId, validateWith(documentQuestionSchema)], async (req: Request, res: Response): Promise<any> => {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(400).json({ message: 'Invalid document ID provided!' });

    const response = await generateResponseToDocumentQuestion(document.content, req.body.question);
    if (!response) return res.status(404).json({ message: 'Could not find an answer to your question!' });
    
    const newEnquiry = {
        question: req.body.question,
        response,
    };
    
    document.enquiries.push(newEnquiry);
    await document.save();

    res.json(newEnquiry);    
});

router.get('/:id', [auth, validateObjectId], async (req: Request, res: Response): Promise<any> => {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(400).json({ message: 'Invalid document ID provided!' });

    res.json(_.pick(document, ['_id', 'fileName', 'content', 'enquiries']));
});

router.get('/', [auth], async (req: Request, res: Response): Promise<any> => {
    const documents = await Document.find().select('_id fileName')
    res.json(documents);
});

export default router;