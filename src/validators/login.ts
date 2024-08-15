import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
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
});

const loginValidator = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { body } = req;

    const { error } = loginSchema.validate(body);

    if (error) {
        const { message } = error.details[0];
        const formatedMessage = message.replace(/['"]/g, '');
        return res.status(400).send({
            success: false,
            error: formatedMessage,
        });
    }
    next();
};

export default loginValidator;
