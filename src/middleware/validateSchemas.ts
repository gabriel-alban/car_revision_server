import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { logger } from './errorLogger.js';

export const validate = (schema: z.ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        } catch (err) {
            if (err instanceof ZodError) {
                logger.error({ message: 'Validation failed', issues: err.issues });
                return res.status(400).json({ errors: err.issues.map((e) => `Invalid input for ${e.path.join(',')}`) });
            }

            logger.error({ message: 'Validation Failed (non-zod)', err });
            return res.status(500).json({ message: 'Validation Failed' });
        }
    }