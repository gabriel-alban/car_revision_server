import { Request, Response } from "express";
import { User } from "../models/userModel.js";

class UserController {
    async getUsers(req: Request, res: Response): Promise<Response> {
        try{
            const users = await User.find({});

            return res.status(200).json({users});
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong!'});
        }
        
    }
}

export default new UserController();