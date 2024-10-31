
import Joi from 'joi';

export const newDocumentSchema = Joi.object({
    url: Joi.string().uri(),
    type: Joi.string().valid('pdf'),
    documentNumber: Joi.string().min(3).required(),
    name: Joi.string().min(3),
    tags: Joi.array().items(Joi.string().min(1)).min(1).required()
});

export const updateDocumentSchema = Joi.object({
    url: Joi.string().uri(),
    type: Joi.string().valid('pdf'),
});

export const documentQuestionSchema = Joi.object({
    question: Joi.string().min(5).required().label('Question'),
})

export interface NewDocumentData {
    url: string;
    type: string;
    documentNumber: string;
    name: string;
    tags: string;
}
