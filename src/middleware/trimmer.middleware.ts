import { Request, Response, NextFunction } from 'express';

const trimmer = (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    Object.keys(body).forEach((key) => {
        if (typeof body[key] === 'string') {
            body[key] = body[key].trim();
        }
    });
    return next();
};

export default trimmer;
