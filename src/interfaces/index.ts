import { Request } from 'express';

interface AuthenticatedRequest extends Request {
    user?: { id: string; isAdmin: boolean };
}

export type { AuthenticatedRequest };
