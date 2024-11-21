
import Joi from 'joi';
import { FileType } from '../../utils/constants';

export const newDocumentSchema = Joi.object({
    url: Joi.string().uri(),
    type: Joi.string().valid('txt', 'pdf'),
    documentNumber: Joi.string().min(3).required(),
    name: Joi.string().min(3),
    tags: Joi.array().items(Joi.string().min(1)).min(1).required()
});

export const updateDocumentSchema = Joi.object({
    url: Joi.string().uri(),
    type: Joi.string().valid(FileType.TXT, FileType.PDF),
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
