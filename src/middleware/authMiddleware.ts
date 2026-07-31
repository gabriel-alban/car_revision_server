import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): Response | void => {
    const authHeader = req.header('Authorization');
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) return res.status(500).json({ error: 'Secret key is missing' });

    if(!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({error: 'Access Denied!'});
    }

    const parts = authHeader.trim().split(/\s+/);
    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
        return res.status(401).json({ error: 'Invalid authorization format' });
    }

    const token = parts[1];
    
    if(!token) return res.status(401).json({error: 'Access Denied!'});

    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded === 'string') {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = decoded as Request['user'];
        return next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}