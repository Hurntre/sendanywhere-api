import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import User from '../db/models/user';

const signupSchema = Joi.object({
    firstName: Joi.string()
        .required()
        .pattern(/^[a-zA-Z]{5,30}$/),
    lastName: Joi.string()
        .required()
        .pattern(/^[a-zA-Z]{5,30}$/),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
        .external(async (value) => {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) {
                throw new Joi.ValidationError(
                    'Email already in use',
                    [
                        {
                            message: 'Email already in use',
                            path: ['email'],
                            type: 'unique',
                        },
                    ],
                    value
                );
            }
            return value;
        }),
    phone: Joi.string()
        .required()
        .max(11)
        .external(async (value) => {
            const existingUser = await User.findOne({ phone: value });
            if (existingUser) {
                throw new Joi.ValidationError(
                    'Phone number already in use',
                    [
                        {
                            message: 'Phone number already in use',
                            path: ['email'],
                            type: 'unique',
                        },
                    ],
                    value
                );
            }
            return value;
        }),
    password: Joi.string()
        .required()
        .min(8)
        .max(128)
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/
        )
        .messages({
            'string.pattern.base':
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            'string.min': 'Password must be at least 12 characters long',
            'string.max': 'Password cannot exceed 128 characters',
        }),
    confirmPassword: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your password',
    }),
}).with('password', 'confirmPassword');

const signupValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    try {
        await signupSchema.validateAsync(body);
        next();
    } catch (error) {
        if (error instanceof Joi.ValidationError) {
            const errors = error.details.map((detail) => ({
                field: detail.path[0],
                message: detail.message.replace(/['"]/g, ''),
            }));
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        // Handle other types of errors
        console.error('Validation error:', error);
        return res.status(500).json({
            success: false,
            message: 'An unexpected error occurred',
        });
    }

    // const { error } = signupSchema.validate(body);

    // if (error) {
    //     const { message } = error.details[0];
    //     const formatedMessage = message.replace(/['"]/g, '');
    //     return res.status(400).send({
    //         success: false,
    //         error: formatedMessage,
    //     });
    // }
};

export default signupValidator;
