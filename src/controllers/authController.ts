import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import hash from "../helpers/hash.js";

class AuthController {
    async me(req: Request, res: Response) {

    }

    async register(req: Request, res: Response) {
        try {
            let user = await User.findOne({email: req.body.email});
            if(user) return res.status(409).json({error: 'User already registered!'})
            
            const password = await hash.encrypt(req.body.password);
            user = new User({...req.body, password: password});

            await user.save();

            const token = user.generateToken();

            return res.header('X-AUTH-TOKEN', token).status(201).json(user);
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong'});
        }
    }

    async login(req: Request, res: Response) {

    }
}

export default new AuthController();
