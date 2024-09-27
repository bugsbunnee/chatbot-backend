import { Post } from '../models/post';
import { IPost } from '../models/post/schema';

import Queue from 'bull';
import moment from 'moment';

const postQueue = new Queue('postQueue');

postQueue.process(async (job) => {
    const post = await Post.findById(job.data.postId);
    if (!post) return;

    post.status = 'published';
    await post.save();
});

export const schedulePost = async (post: IPost ) => {
    const delay = moment(post.scheduleTime).diff(moment(), 'millisecond');
    await postQueue.add({ postId: post._id }, { delay });
};
