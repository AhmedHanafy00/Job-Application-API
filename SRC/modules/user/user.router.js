import { Router } from "express";
import * as userController from "./user.controller.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { activateSchema, changePasswordSchema, deleteUserSchema, forgetCodeSchema, getAccountDataSchema, logoutSchema, recEmailAccSchema, resetPasswordSchema, signinSchema, signupSchema, updateUserSchema } from "./user.schema.js";

const router = Router();

//API to signup a user 

router.post("/",validation(signupSchema),userController.signupUser)

//API to signin a user 

router.post("/signin",validation(signinSchema),userController.signin)


// API to change the password or "UPDATE password"

router.put("/changePassword",validation(changePasswordSchema),isAuthenticated,userController.changePassword)

//API to update a user

router.patch("/updateUser",validation(updateUserSchema),isAuthenticated,userController.updateUser)

//API to delete a user  

router.delete("/deleteUser",isAuthenticated,validation(deleteUserSchema),userController.deleteUser)


//API to get user account data

router.get("/getAccountData",isAuthenticated,validation(getAccountDataSchema),userController.getAccountData)

//API to get profile data

router.get("/profileData/:id",userController.profileData)

//API to activate an account

router.get("/activate_account/:token",validation(activateSchema),userController.activateAccount)

//API to send the "forget Password" code

router.patch("/forget_code",validation(forgetCodeSchema) ,userController.sendForgetCode)

//API to reset the password

router.patch("/resetPassword",validation(resetPasswordSchema),userController.resetPassword)

//API to get accounts related to recovery email

router.get("/recoveryEmailAccounts",isAuthenticated,validation(recEmailAccSchema),userController.recoveryEmailAccounts)

// API to make the user logout

router.post("/logout",isAuthenticated,validation(logoutSchema),userController.logout)

export default router;