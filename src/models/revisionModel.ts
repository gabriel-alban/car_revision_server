import mongoose from "mongoose";
import { lowercase } from "zod";
import { RevisionType } from "../types/revision.js";

const revisionSchema = new mongoose.Schema({
    revision_title: {
        type: String,
        required: [true, "Revision title is required"],
    },
    revision_description: {
        type: String,
    },
    current_km_number: {
        type: Number,
        required: [true, "Current number of km"],
    },
    next_km_number: {
        type: Number,
    },
    revision_type: {
        type: String,
        enum: Object.values(RevisionType),
        required: true,
        trim: true,
        lowercase: true,
        default: RevisionType.CONSUMABLE
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: Date.now,
    },
    sendAlert: {
        type: Boolean,
        default: true,
    },
    car: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    },
});

export const Revision = mongoose.model('Revision', revisionSchema);