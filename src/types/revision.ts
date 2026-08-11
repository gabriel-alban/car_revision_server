import { Types } from "mongoose";
import { ICar } from "./car.js";

export enum RevisionType {
    CONSUMABLE = 'consumable',
    REPLACEMENT = 'replacement',
}
export interface IRevision {
    revision_title: string;
    revision_description: string;
    current_km_number: number;
    next_km_number: number;
    revision_type: RevisionType,
    date: Date;
    sendAlert: boolean;
    car: Types.ObjectId | ICar,
}