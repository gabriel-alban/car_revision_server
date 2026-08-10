import mongoose, {Model, HydratedDocument} from "mongoose";
import jwt from 'jsonwebtoken';

export interface IUser {
    username: string;
    email: string;
    password: string;
}

interface IUserMethods {
    generateToken(): string;
    generateRefreshToken(): string;
}

type UserModel = Model<IUser, {}, IUserMethods>

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
    const expiresIn = process.env.ACCESS_TOKEN_TTL || '15m';
    return jwt.sign({_id: this._id, username: this.username}, secret, {expiresIn} as jwt.SignOptions);
}

userSchema.methods.generateRefreshToken = function() {
    const secret = process.env.JWT_REFRESH_SECRET_KEY;
    if (!secret) throw new Error('Refresh secret key is missing!');
    const expiresIn = process.env.REFRESH_TOKEN_TTL || '7d';
    return jwt.sign({_id: this._id, username: this.username}, secret, { expiresIn } as jwt.SignOptions);
}

export const User = mongoose.model<IUser, UserModel>('User', userSchema);