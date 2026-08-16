import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel.js";
import hash from "../helpers/hash.js";
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from "../helpers/mailer.js";

class AuthController {
    async me(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const userId = req.user?._id;
            if (!userId) return res.status(401).json({ error: 'Access denied' });

            const user = await User.findById(userId).select("-password");
            if (!user) return res.status(404).json({ error: 'User not found!' });

            return res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) return res.status(409).json({ error: 'User already registered!' })

            const password = await hash.encrypt(req.body.password);
            user = new User({ ...req.body, password: password });

            await user.save();

            try {
                await sendWelcomeEmail(user.email, user.username);
            } catch (e) {
                console.log(e);
                throw new Error('Send mail failed!')
            }

            const token = user.generateToken();
            const refreshToken = user.generateRefreshToken();

            const safeUser = user.toObject();
            delete (safeUser as any).password;

            return res.status(201).json({ user: safeUser, token, refreshToken });
        } catch (err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            let user = await User.findOne({ email: req.body.email });

            if (!user) return res.status(400).json({ error: 'Invalid Email' });

            const validPass = await hash.compare(req.body.password, user.password);

            if (!validPass) return res.status(400).json({ error: 'Invalid Password' });

            const token = user.generateToken();
            const refreshToken = user.generateRefreshToken();

            return res.status(200).json({ user: { username: user.username, email: user.email }, token, refreshToken });
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) {
                return res.status(401).json({ error: 'Refresh token is missing' });
            }
            const secret = process.env.JWT_REFRESH_SECRET_KEY;
            if (!secret) return res.status(500).json({ error: 'Refresh secret key is missing' });

            let decoded: jwt.JwtPayload | string;

            try {
                decoded = jwt.verify(refreshToken, secret);
            } catch (e) {
                return res.status(401).json({ error: 'Invalid or expired refresh token' });
            }

            if (typeof decoded === 'string' || !decoded._id) {
                return res.status(401).json({ error: 'Invalid refresh token payload!' })
            }

            const user = await User.findById(decoded._id);
            if (!user) return res.status(401).json({ error: 'User not found' });

            const token = user.generateToken();
            const newRefreshToken = user.generateRefreshToken();

            return res.status(200).json({ token, refreshToken: newRefreshToken });
        } catch (err) {
            next(err);
        }
    }
}

export default new AuthController();
