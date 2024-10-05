import express, { Request, Response } from 'express';
import axios from 'axios';
import _ from 'lodash';
import pdfParse from 'pdf-parse';

import admin from '../../middleware/admin';
import auth from '../../middleware/auth';
import validateWith from '../../middleware/validateWith';
import validateObjectId from '../../middleware/validateObjectId';

import { newDocumentSchema, updateDocumentSchema } from './schema';
import { Document } from '../../models/document';

const router = express.Router();

router.post('/upload', [auth, admin, validateWith(newDocumentSchema)], async (req: Request, res: Response): Promise<any> => {
    const response = await axios.get(req.body.url, { responseType:'arraybuffer'});
    const data = await pdfParse(response.data);

    const versionNumber = 1;
    const document = new Document({
        name: req.body.name,
        tags: req.body.tags,
        documentNumber: req.body.documentNumber,
        lastInsertedVersion: versionNumber,
        history: { content: data.text, version: versionNumber, url: req.body.url },
        enquiries: [],
    });

    await document.save();

    res.status(201).json(document);
});

router.get('/dashboard', [auth, admin], async (req: Request, res: Response) => {
    const totalDocumentsPromise = Document.countDocuments();

    const topTagsPromise = Document.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 } // Top 5 tags
    ]);

    const [totalDocuments, topTags] = await Promise.all([totalDocumentsPromise, topTagsPromise]);
 
    res.json({
        totalDocuments,
        topTags
    });
});

router.put('/:id', [auth, admin, validateObjectId, validateWith(updateDocumentSchema)], async (req: Request, res: Response): Promise<any> => {
    const response = await axios.get(req.body.url, { responseType:'arraybuffer'});
    const data = await pdfParse(response.data);

    const document = await Document.findByIdAndUpdate(req.params.id);
    if (!document) return res.status(404).json({ message: 'The document with the given ID does not exist' });

    document.lastInsertedVersion += 1;
    document.history.push({ version: document.lastInsertedVersion, content: data.text, url: req.body.url });
    await document.save();

    res.json(document);
});

router.get('/:id', [auth, admin, validateObjectId], async (req: Request, res: Response): Promise<any> => {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'The document with the given ID does not exist' });
    
    res.json(document);
});

router.get('/', [auth, admin], async (req: Request, res: Response): Promise<any> => {
    const documents = await Document
                                .find()
                                .select('_id name createdAt tags documentNumber lastInsertedVersion')
                                .sort({ createdAt: 1 });

    res.json(documents);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req: Request, res: Response): Promise<any> => {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'The document with the given ID does not exist' });
    
    res.json(_.pick(document, ['_id']));
});

export default router;