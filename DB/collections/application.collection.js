import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const appSchema = new Schema({
    jobId: { type: Types.ObjectId, ref: 'Job', required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    userTechSkills: { type: [String], required: true },
    userSoftSkills: { type: [String], required: true },
    userResume: { public_id: { type: String },
    secure_url: { type: String },},


}, {
    timestamps: true
})

export const Application = mongoose.model("Application", appSchema);