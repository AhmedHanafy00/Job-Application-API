import { Router } from "express";
import * as jobsController from "./jobs.controller.js"
import { isAuthenticated, roleAuthenticated, userAuthenticated } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addJobSchema, updateJobSchema } from "./jobs.schema.js";
import { uploadFileCloud } from "../../utilities/multerCloud.js";

const router = Router();

//API to add  company

router.post("/addJobs", validation(addJobSchema), roleAuthenticated, jobsController.addJobs)

//API to Update Job

router.put("/updateJob", validation(updateJobSchema), roleAuthenticated, jobsController.updateJob)

//API to delete Job

router.delete("/deleteJob/:_id", roleAuthenticated, jobsController.deleteJob)

//API to get all Jobs

router.get("/jobsWithCompanies", isAuthenticated, jobsController.jobsWithCompanies)

//API to get all Jobs for a specific company

router.get("/jobsForSpecificCompany", isAuthenticated, jobsController.jobsForSpecificCompany)

//API to get specific Jobs with specific filters

router.get("/sepcificJob", isAuthenticated, jobsController.sepcificJob)


//API for Apply to Job (job application) (upload documents)

router.post("/applyForJob",uploadFileCloud().single("resume"),userAuthenticated,jobsController.applyForJob)

export default router;