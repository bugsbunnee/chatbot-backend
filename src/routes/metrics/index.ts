import express, { Request, Response } from 'express';
import { Post } from '../../models/post';

import admin from '../../middleware/admin';
import auth from '../../middleware/auth';

const router = express.Router();

router.get('/', [auth, admin], async (req: Request, res: Response) => {
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