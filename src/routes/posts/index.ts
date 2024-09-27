import express, { Request, Response } from 'express';
import { rateLimit } from 'express-rate-limit';

import _ from 'lodash';

import auth from '../../middleware/auth';
import admin from '../../middleware/admin';
import validateObjectId from '../../middleware/validateObjectId';
import validateWith from '../../middleware/validateWith';

import { createCompletion } from '../../utils/openai';
import { Post } from '../../models/post';
import { calculatePaginationData } from '../../utils/lib';
import { postZodSchema } from '../../models/post/schema';

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 50 * 1000,
    limit: 5,
    message: 'Too many AI requests. Please try again after 15 minutes'
})

router.post('/approve/:id', [auth, admin, validateObjectId], async (req: Request, res: Response): Promise<any> => { 
    const post = await Post.findById(req.params.id);
    
    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    if (['approved', 'published'].includes(post.status)) {
        return res.status(400).json({ message: 'Post in invalid state for approval!' });
    }

    post.status = 'approved';
    post.approver = req.user?._id;

    await post.save();

    res.json(_.pick(post, ['status', '_id']));
});

router.post('/', [auth, limiter, validateWith(postZodSchema as any)], async (req: Request, res: Response): Promise<any> => {
    let content = req.body.content;
    
    if (req.body.useAI) {
        content = await createCompletion(req.body.platform, req.body.content);
    }

    const post = new Post({
        content,
        platform: req.body.platform,
        media: req.body.media,
        scheduleTime: req.body.scheduleTime,
        user: req.user?._id,
        status: 'pending'
    });

    await post.save();

    res.status(201).json(_.pick(post, ['_id']));
});

router.get('/', [auth, admin], async (req: Request, res: Response) => {
    const totalPosts = await Post.countDocuments();
    const pagination = await calculatePaginationData(req, totalPosts);

    const posts = await Post.find()
                        .skip(pagination.offset)
                        .limit(pagination.limit);

    res.send({ posts, pagination });
});

router.get('/me', auth, async (req: Request, res: Response) => {
    const userData = { user: req.user?._id };

    const totalPosts = await Post.find(userData).countDocuments();
    const pagination = await calculatePaginationData(req, totalPosts);

    const posts = await Post.find(userData)
                        .skip(pagination.offset)
                        .limit(pagination.limit)

    res.send({ posts, pagination });
});

router.get('/:id/metrics', [auth, validateObjectId], async (req: Request, res: Response) => {
    const result = await Post.aggregate([
        {
            $addFields: {
                date: {"$toDate": "$_id"}
            },
        },
        {
            $group: {
                _id: '$user',
                totalPosts: { $sum: 1 },
                totalLikes: { $sum: '$likes' },
                totalViews: { $sum: '$views' },
                totalShares: { $sum: '$shares' },
                averageLikes: { $avg: '$likes' },
                averageViews: { $avg: '$views' },
            },
        },
        {
            $project: {
                _id: 0,
                totalViews: 1,
                totalLikes: 1,
                totalPosts: 1,
                totalShares: 1,
                roundedAverageLikes: { $round: ['$averageLikes', 0 ]},
                roundedAverageViews: { $round: ['$averageViews', 0 ]},
                engagementRate: {
                    $cond: { 
                      if: { $gt: ['$totalViews', 0] },
                      then: { $round: [{ $divide: [{ $add: ['$totalLikes', '$totalShares'] }, '$totalViews']}, 1]},
                      else: 0 
                    }
                }
            }
        }
    ]);

    res.json({ overview: result[0] });
});

export default router;