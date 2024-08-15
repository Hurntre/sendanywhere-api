import { Response } from 'express';
import { AuthenticatedRequest } from '../interfaces';
import User from '../db/models/user';

class UserController {
    static async profile(req: AuthenticatedRequest, res: Response) {
        try {
            const userProfile = await User.findOne({
                _id: req.user?.id,
            });

            if (!userProfile) {
                return res.status(404).send({
                    code: 404,
                    success: false,
                    message: 'User not found',
                });
            }

            return res.status(200).send({
                code: 201,
                success: true,
                data: userProfile,
                message: 'User profile fetched successfully',
            });
        } catch (error) {
            console.error('Fetch user profile error:', error);
            return res.status(500).send({
                code: 500,
                success: false,
                message: 'An error occurred fetching user profile',
            });
        }
    }
}

export default UserController;
