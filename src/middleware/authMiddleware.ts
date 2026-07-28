import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('X-AUTH-TOKEN');
    const secret = process.env.JWT_SECRET_KEY;
    if(!secret) return res.status(500).json({error: 'Secret key is missing'});
    if (!token) return res.status(401).json({error: 'Access Denied!'});

    try {
        const decoded = jwt.verify(token, secret);
        if (typeof decoded === 'string') {
            return res.status(401).json({error: 'Invalid token'});
        }

        req.user = decoded as Request['user'];
        return next();
    } catch(err) {
        return res.status(401).json({error: 'Invalid token'});
    }
}