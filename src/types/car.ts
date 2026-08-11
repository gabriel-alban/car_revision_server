import { Types } from "mongoose";
import { IUser } from "../models/userModel.js";

export interface ICar {
    brand: string;
    model: string;
    km_range: number;
    user: Types.ObjectId | IUser;
}