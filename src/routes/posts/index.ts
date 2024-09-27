import express, { Request, Response } from 'express';
import _ from 'lodash';

import auth from '../../middleware/auth';
import admin from '../../middleware/admin';
import validateObjectId from '../../middleware/validateObjectId';

import { createCompletion } from '../../utils/openai';
import { Post } from '../../models/post';
import { schedulePost } from '../../utils/schedule';
import { calculatePaginationData } from '../../utils/lib';
import { postZodSchema } from '../../models/post/schema';

import validateWith from '../../middleware/validateWith';

const router = express.Router();

router.post('/approve/:postId', [auth, admin, validateObjectId], async (req: Request, res: Response): Promise<any> => { 
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.status = 'approved';
    post.approver = req.user?._id;

    await post.save();
    await schedulePost(post);

    res.json(_.pick(post, ['status', '_id']));
});

router.post('/', [auth, validateWith(postZodSchema as any)], async (req: Request, res: Response): Promise<any> => {
    let content = req.body.content;
    
    if (req.body.useAI) {
        content = await createCompletion(req.body.platform, req.body.content);
    }

    const post = new Post({
        content,
        platform: req.body.platform,
        user: req.user?._id,
        scheduleTime: req.body.scheduleTime,
        status: 'pending'
    });

    await post.save();

    res.status(201).json(_.pick(post, ['_id']));
});

router.get('/', auth, async (req: Request, res: Response) => {
    const { currentPage, limit, startIndex, total, pages } = await calculatePaginationData(req, Post);

    const posts = await Post.find({ user: req.user?._id })
                        .skip(startIndex)
                        .limit(limit)

    res.send({ posts, total, pages, currentPage, limit });
});

export default router;