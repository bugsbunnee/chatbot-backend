import moment from 'moment';
import cron from 'node-cron';

import { Post } from '../models/post';

export const publishPendingPostsJob = async () => {
    cron.schedule('* * * * *', async () => {
        const results = await Post.updateMany({ status: 'approved', scheduleTime: { $gte: moment().format() } }, { 
            $set: { status: 'published' },
        });

        console.log(results);
    });
};
