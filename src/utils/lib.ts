import { Request } from "express";
import { Model } from "mongoose";

export const calculatePaginationData = async (req: Request, model: typeof Model) => {
    const query = {
        pageNumber: parseInt(req.query.pageNumber as string) || 1,
        pageSize: parseInt(req.query.pageSize as string) || 10
    };

    const startIndex = (query.pageNumber - 1) * query.pageSize;
    const limit = query.pageSize;
    
    const total = await model.countDocuments();

    return {
        currentPage: query.pageNumber,
        total,
        limit,
        startIndex,
        pages: Math.ceil(total / limit)
    };
};

