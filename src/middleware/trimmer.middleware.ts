import { Request, Response, NextFunction } from 'express';

const trimmer = (req: Request, res: Response, next: NextFunction) => {
    req.body = Object.keys(req.body).forEach((key) => {
        if (typeof req.body[key] === 'string') {
            req.body[key] = req.body[key].trim();
        }
    });
    next();
};

export default trimmer;
