import express, { Request, Response } from 'express';
import _ from 'lodash';

import admin from '../../middleware/admin';
import auth from '../../middleware/auth';
import validateWith from '../../middleware/validateWith';
import validateObjectId from '../../middleware/validateObjectId';

import { newDocumentSchema, updateDocumentSchema } from './schema';
import { Document } from '../../models/document';

const router = express.Router();

router.post('/upload', [auth, admin, validateWith(newDocumentSchema)], async (req: Request, res: Response): Promise<any> => {    
    const versionNumber = 1;
    
    const document = new Document({
        name: req.body.name,
        tags: req.body.tags,
        documentNumber: req.body.documentNumber,
        lastInsertedVersion: versionNumber,
        isAnalyzed: false,
        history: [{ version: versionNumber, url: req.body.url, type: req.body.type }],
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

    const analysedDocumentsPromise = Document.aggregate([
        { $match: { isAnalyzed: true }}, 
        { $count: "totalCount" }, 
    ]);
    
    const notAnalysedDocumentsPromise = Document.aggregate([
        { $match: { isAnalyzed: false }}, 
        { $count: "totalCount" }, 
    ]);

    const [totalDocuments, topTags, analysedDocuments, notAnalysedDocuments] = await Promise.all([
        totalDocumentsPromise, 
        topTagsPromise, 
        analysedDocumentsPromise,
        notAnalysedDocumentsPromise
    ]);
 
    res.json({
        totalDocuments,
        topTags,
        analysedDocuments: analysedDocuments.length > 0 ? analysedDocuments[0].totalCount : 0,
        notAnalysedDocuments: notAnalysedDocuments.length > 0 ? notAnalysedDocuments[0].totalCount : 0
    });
});

router.put('/:id', [auth, admin, validateObjectId, validateWith(updateDocumentSchema)], async (req: Request, res: Response): Promise<any> => {
    const document = await Document.findById(req.params.id);
    if (!document) return res.status(404).json({ message: 'The document with the given ID does not exist' });

    document.lastInsertedVersion += 1;
    document.isAnalyzed = false;
    document.history.push({ version: document.lastInsertedVersion, url: req.body.url, type: req.body.type });
    
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
                                .select('_id name isAnalyzed createdAt tags documentNumber lastInsertedVersion')
                                .sort({ createdAt: 1 });

    res.json(documents);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req: Request, res: Response): Promise<any> => {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ message: 'The document with the given ID does not exist' });
    
    res.json(_.pick(document, ['_id']));
});

export default router;