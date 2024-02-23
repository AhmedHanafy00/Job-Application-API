import joi from "joi";
export const signupSchema = joi.object({
    firstName : joi.string().required(),
    lastName : joi.string().required(),
    userName: joi.string().alphanum(),
    email: joi.string().email().required(),
    recoveryEmail : joi.string().email(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: joi.string().valid(joi.ref("password")),
    phone: joi.number().required(),
    role : joi.string().valid('user','Company_HR').default('user').required(),
    DOB : joi.date().iso().required(),


}).required();


export const signinSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
}).required();

export const changePasswordSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    newPassword: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
}).required();

export const updateUserSchema = joi.object({
    email: joi.string().email().required(),
    phone: joi.number().required(),
}).required();

export const getAccountDataSchema = joi.object({
    email: joi.string().email().required(),
}).required();

export const deleteUserSchema = joi.object({
    email: joi.string().email().required(),
}).required();

export const activateSchema = joi.object({
    token: joi.string().required(),
}).required();


export const forgetCodeSchema = joi.object({
    email: joi.string().email().required(),
}).required();


export const resetPasswordSchema = joi.object({
    email: joi.string().email().required(),
    code: joi.string().length(5).required(),
    password: joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    confirmPassword: joi.string().valid(joi.ref("password")),
}).required();


export const recEmailAccSchema = joi.object({
    recoveryEmail : joi.string().email().required(),
}).required();



export const logoutSchema = joi.object({
    token: joi.string().required(),
}).required();