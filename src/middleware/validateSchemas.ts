import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodTypeAny) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse({
                body: req.body,
                params: req.params,
                query: req.query
            });
            next();
        } catch(err) {
            if (err instanceof ZodError) {
                return res.status(400).json({errors: err.issues})
            }

            return res.status(500).json({message: 'Validation Failed'});
        }
    }