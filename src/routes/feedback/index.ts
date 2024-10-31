import express, { Request, Response } from 'express';
import validateWith from '../../middleware/validateWith';

import { Feedback } from '../../models/feedback';
import { feedbackJoiSchema } from '../../models/feedback/schema';

const router = express.Router();

router.post('/', validateWith(feedbackJoiSchema), async (req: Request, res: Response) => {
    const feedback = new Feedback({
        subject: req.body.subject,
        message: req.body.message
    });

    await feedback.save();

    res.json({ message: 'Saved successfully' });
});

export default router;