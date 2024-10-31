import Joi from 'joi';

export const messageJoiSchema = Joi.object({
    message: Joi.string().min(2).required().label("Message")
});

export interface IMessage {
    message: string;
}