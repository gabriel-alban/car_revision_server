import 'dotenv/config';
import winston from 'winston';
import { MongoDB } from 'winston-mongodb';
import { NextFunction, Request, Response } from 'express';

export const logger = winston.createLogger({
    transports: [
        //
        // - Write all logs with importance level of `error` or higher to `error.log`
        //   (i.e., error, fatal, but not other levels)
        //
        new winston.transports.File({ filename: 'error.log', level: 'error', format: winston.format.combine(winston.format.timestamp(), winston.format.json()) }),
        //
        // - Write all logs with importance level of `info` or higher to `combined.log`
        //   (i.e., fatal, error, warn, and info, but not trace)
        //
        new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(), winston.format.simple()), level: "info" }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log' }),
    ],
})


logger.exceptions.handle(new winston.transports.File({ filename: 'exceptions.log' }));

// reuse the app's own connection string instead of an unreachable hardcoded db
const mongoUrl = process.env.MONGO_URL;

if (mongoUrl) {
    const mongoTransport = new MongoDB({ db: mongoUrl, collection: 'error_logs', level: 'error' });
    // avoid crashing the process if the mongo transport can't connect/write
    mongoTransport.on('error', (err) => console.error('MongoDB log transport error:', err));
    logger.add(mongoTransport);
} else {
    console.warn('MONGO_URL is not set; skipping MongoDB log transport.');
}

export const error = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    logger.error({ message: err.message });
    res.status(500).json({ message: err.message });
}