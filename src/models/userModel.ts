import mongoose, {Model, HydratedDocument} from "mongoose";
import jwt from 'jsonwebtoken';

export interface IUser {
    username: string;
    email: string;
    password: string;
}

interface IUserMethods {
    generateToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>
type UserDocument = HydratedDocument<IUser, IUserMethods>

export const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    username: {
        required: [true, "Username is required!"],
        type: String,
        minLength: 8,
        maxLength: 50,
    },
    email: {
        required: [true, "Email is required!"],
        type: String,
        minLength: 10,
        maxLength: 255,
    },
    password: {
        required: [true, "Password is required!"],
        type: String,
        minLength: 8,
        maxLength: 255,
        trim: true,
    }
});

userSchema.methods.generateToken = function() {
    const secret = process.env.JWT_SECRET_KEY;
    if (!secret) throw new Error('Secret key is missing!');
    return jwt.sign({_id: this._id, username: this.username}, secret);
}

export const User = mongoose.model<IUser, UserModel>('User', userSchema);