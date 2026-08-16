import { NextFunction, Request, Response } from "express";
import { User } from "../models/userModel.js";

class UserController {
    async getUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try{
            const users = await User.find({}).select("-password");

            return res.status(200).json({users});
        } catch(err) {
            next(err);
        }
        
    }
}

export default new UserController();