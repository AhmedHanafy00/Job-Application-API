import joi from "joi";
import { objectIdValidation } from "./../../middleware/validation.middleware.js";


export const addJobSchema = joi.object({
    jobTitle: joi.string().required(),
    jobDescription: joi.string().required(),
    jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').default('onsite').required(),
    workingTime: joi.string().valid('full-time', 'part-time').default('full-time').required(),
    seniorityLevel: joi.string().valid('Junior', 'Mid-level', 'Senior', 'Team-Lead', 'CTO').required(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    addedBy: joi.custom(objectIdValidation).required(),
    companyID: joi.custom(objectIdValidation).required(),
}).required();

export const updateJobSchema = joi.object({
    jobTitle: joi.string().required(),
    jobDescription: joi.string().required(),
    jobLocation: joi.string().valid('onsite', 'remotely', 'hybrid').default('onsite').required(),
    workingTime: joi.string().valid('full-time', 'part-time').default('full-time').required(),
    seniorityLevel: joi.string().valid('Junior', 'Mid-level', 'Senior', 'Team-Lead', 'CTO').required(),
    technicalSkills: joi.array().items(joi.string()),
    softSkills: joi.array().items(joi.string()),
    addedBy: joi.custom(objectIdValidation).required(),
    companyID: joi.custom(objectIdValidation).required(),

}).required();

