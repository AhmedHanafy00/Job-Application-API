import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const companySchema = new Schema({
    companyName: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    industry: { type: String, required: true },
    address: { type: String, },
    numberOfEmployees: {
        type: Number,
        min: 11,
        max: 20,
    },
    companyEmail: { type: String, required: true, unique: true },
    companyHR: { type: Types.ObjectId, ref: "User" },
    companyJobs: { type: Types.ObjectId, ref: "Job" }

}, {
    timestamps: true
})

export const Company = mongoose.model("Company", companySchema);