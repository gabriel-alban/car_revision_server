import { Request, Response } from "express";
import { User } from "../models/userModel.js";
import hash from "../helpers/hash.js";

class AuthController {
    async me(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if(!userId) return res.status(401).json({error: 'Access denied'});

            const user = User.findById(req.body._id).select("-password");
            if(!user) return res.status(404).json({error: 'User not found!'});

            return res.status(200).json(user);
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong!'})
        }
    }

    async register(req: Request, res: Response) {
        try {
            let user = await User.findOne({email: req.body.email});
            if(user) return res.status(409).json({error: 'User already registered!'})
            
            const password = await hash.encrypt(req.body.password);
            user = new User({...req.body, password: password});

            await user.save();

            const token = user.generateToken();
            const safeUser = user.toObject();
            delete (safeUser as any).password;

            return res.header('X-AUTH-TOKEN', token).status(201).json(safeUser);
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong'});
        }
    }

    async login(req: Request, res: Response) {
        try {
            let user = await User.findOne({email: req.body.email});

            if(!user) return res.status(400).json({error: 'Invalid Email'});

            const validPass = await hash.compare(req.body.password, user.password);

            if(!validPass) return res.status(400).json({error: 'Invalid Password'});

            const token = user.generateToken();

            return res.header('X-AUTH-TOKEN', token).status(200).json(user);
        } catch(err) {
            return res.status(500).json({error: 'Something went wrong'});
        }
    }
}

export default new AuthController();
