import moment from 'moment';
import cron from 'node-cron';

import { Post } from '../models/post';

export const publishPendingPostsJob = async () => {
    cron.schedule('* * * * *', async () => {
        await Post.updateMany({ status: 'approved', scheduleTime: { $gte: moment().format() } }, { 
            $set: { status: 'published' },
        });
    });
};
