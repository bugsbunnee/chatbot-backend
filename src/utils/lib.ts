import { Request } from "express";
import { Model } from "mongoose";

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

