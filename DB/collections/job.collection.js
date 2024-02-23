import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const jobSchema = new Schema({
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobLocation: {
        type: [
            {
                type: String,
                enum: ["onsite", "remotely", "hybrid"],
                default: ["onsite"]
            }
        ],
        required: true,
    },
    workingTime: {
        type: [
            {
                type: String,
                enum: ["full-time", "part-time"],
                default: ["full-time"]
            }
        ],
        required: true,
    },
    seniorityLevel: {
        type: [
            {
                type: String,
                enum: ["Junior", "Mid-level", "Senior", "Team-Lead", "CTO"],
            }
        ],
        required: true,

    },
    technicalSkills: [{ type: String }],
    softSkills: [{ type: String }],
    addedBy: { type: Types.ObjectId, ref: "User" },
    companyID: { type: Types.ObjectId, ref: "Company" },
    resume : {secure_url : String , public_id : String }

}, {
    timestamps: true
})

export const Job = mongoose.model("Job", jobSchema);