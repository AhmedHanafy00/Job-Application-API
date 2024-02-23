import { Router } from "express";
import * as companyController from "./company.controller.js" 
import { isAuthenticated, roleAuthenticated } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addCompanySchema, updateCompanySchema } from "./company.schema.js";

const router = Router();

//API to add  company

router.post("/addCompany",validation(addCompanySchema),roleAuthenticated,companyController.addCompany)


//API to Update company data

router.put("/updateCompany",validation(updateCompanySchema),roleAuthenticated,companyController.updateCompany)

//API to delete company

router.delete("/deleteCompany/:_id",roleAuthenticated,companyController.deleteCompany)

//API to Get company data 

router.get("/companyData/:_id",roleAuthenticated,companyController.companyData)

//API to Search for a company with a name.

router.get("/searchCompany",isAuthenticated,companyController.searchCompany)

//API to get all aplications for specific job

router.get("/getAppForJobs",roleAuthenticated,companyController.getAppForJobs)

export default router;