import { Request, Response } from 'express';
import User from '../db/models/user';

class AuthController {
    static async signup(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, phone, password } = req.body;

            const newUser = await User.create({
                firstName,
                lastName,
                email,
                phone,
                password,
            });

            return res.status(201).send({
                code: 201,
                success: true,
                data: newUser,
                message: 'User created successfully',
            });
        } catch (error) {
            console.error('Signup error:', error);
            return res.status(500).send({
                code: 500,
                success: false,
                message: 'An error occurred during signup',
            });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({
                code: 404,
                success: false,
                message: 'User not found',
            });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).send({
                code: 401,
                success: false,
                message: 'Invalid password',
            });
        }

        res.status(200).send({
            code: 200,
            success: true,
            message: 'Login successful',
        });
    }
}

export default AuthController;
