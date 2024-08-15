import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../interfaces';

// interface AuthenticatedRequest extends Request {
//     user: string | object;
// }

/**
 * @method auth
 * @description Verifies the token provided by the user
 * @param {*} req
 * @param {*} res
 * @returns {*} - JSON response object
 */

const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).send({
            code: 401,
            success: false,
            message: 'Authorization header missing',
        });
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!process.env.APP_SECRET_KEY) {
        return res.status(500).send({
            code: 500,
            success: false,
            message: 'Server configuration error',
        });
    }

    try {
        const loggedInUser = jwt.verify(token, process.env.APP_SECRET_KEY) as {
            id: string;
            isAdmin: boolean;
        };

        // what if token has expired

        req.user = loggedInUser;
        return next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).send({
            code: 401,
            success: false,
            message: 'Invalid token',
        });
    }
};

export default auth;
