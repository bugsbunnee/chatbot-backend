import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import _ from 'lodash';

import validateWith from '../../middleware/validateWith';

import { authSchema, emailSchema } from './schema';
import { User } from '../../models/user';
import { userJoiSchema } from '../../models/user/schema';

const router = express.Router();

router.post('/initialize', validateWith(emailSchema), async (req: Request, res: Response): Promise<any> => {
    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ isExisting: true, message: 'User already exists' });

    res.json({ isExisting: false, message: 'User not found' });
});

router.post('/login', validateWith(authSchema), async (req: Request, res: Response): Promise<any> => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send({ message: 'User not found' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send({ message: 'Invalid credentials!' });

    const token = user.generateAuthToken();
    res.send({ token });
});

router.post('/register', validateWith(userJoiSchema), async (req: Request, res: Response): Promise<any> => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ message: 'User already exists' });

    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'role']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save()

    res
    .header('x-auth-token', user.generateAuthToken())
    .header('access-control-expose-headers', 'x-auth-token')
    .status(201).send(_.omit(user, ['password']));
});

export default router;