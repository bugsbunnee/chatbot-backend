import Joi from "joi";
import { Request } from "express";


export const calculatePaginationData = async (req: Request, total: number) => {
    const query = {
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10
    };

    const offset = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    
    return {
        currentPage: query.pageNumber,
        total,
        limit,
        offset,
        pages: Math.ceil(total / limit)
    };
};

export const getUserQueryData = (req: Request) => {
    const queryData: Record<string, any> = { 
        user: req.user?._id, 
    };
    
    if (req.query.searchText) {
        queryData.content = { $regex: req.query.searchText, $options: 'i' };
    }

    if (req.query.platform) {
        queryData.platform = req.query.platform;
    }

    return queryData;
};

export const validateEmailDomain = (value: string, helpers: Joi.CustomHelpers<any>) => {
    const [name, domain] = value.split('@');

    if (domain.toLowerCase().indexOf('russelsmithgroup.com') !== -1) return value;

    return helpers.message({ custom: 'Email must be of russelsmith domain!' })
};