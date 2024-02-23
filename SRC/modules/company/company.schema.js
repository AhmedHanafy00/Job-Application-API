import joi from "joi";
import { objectIdValidation } from "./../../middleware/validation.middleware.js";

export const addCompanySchema = joi.object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string(),
    numberOfEmployees: joi.number().min(11).max(20),
    companyEmail: joi.string().required(),
    companyHR: joi.custom(objectIdValidation).required(),


}).required();


export const updateCompanySchema = joi.object({
    companyName: joi.string().required(),
    description: joi.string().required(),
    industry: joi.string().required(),
    address: joi.string(),
    numberOfEmployees: joi.number().min(11).max(20),
    companyHR: joi.custom(objectIdValidation).required(),
}).required();

