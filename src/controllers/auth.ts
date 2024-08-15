import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
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
        try {
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
            
            // do tokens have to last 72 hrs
            // how about they last 5 mins and we progressively slide the expiry window
            // any time a user performs an action 
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.APP_SECRET_KEY || '',
                { expiresIn: '72h' }
            );

            res.status(200).send({
                code: 200,
                success: true,
                message: 'Login successful',
                data: user,
                token,
            });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).send({
                code: 500,
                success: false,
                message: 'An error occurred during login',
            });
        }
    }
}

export default AuthController;
