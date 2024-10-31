import Joi from "joi";

export const feedbackJoiSchema = Joi.object({
    subject: Joi.string().min(3).required().label("Subject"),
    message: Joi.string().min(10).required().label("Message")
});

export interface IFeedback {
    subject: string;
    message: string;
}