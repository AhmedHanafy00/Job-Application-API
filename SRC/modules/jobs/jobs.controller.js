import { Job } from "../../../DB/collections/job.collection.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { Company } from "../../../DB/collections/company.collection.js";
import cloudinary from "../../utilities/cloud.js";
import { Application } from "../../../DB/collections/application.collection.js";
export const addJobs = asyncHandler(async (req, res, next) => {
    const job = await Job.findOne({ addedBy: req.body.addedBy })

    await Job.create(req.body);

    return res.json({ success: true, message: "Job created successfully " });

});


export const updateJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findOne({ addedBy: req.body.addedBy });
    if (!job) {
        res.json({ success: false, message: "Job doesn't exist" }, { cause: 404 })
    }
    if (job.addedBy.toString() !== req.body.addedBy) {
        res.json({ success: false, message: "Incorrect Job " }, { cause: 401 })
    }
    job.jobTitle = req.body.jobTitle;
    job.jobDescription = req.body.jobDescription;
    job.jobLocation = req.body.jobLocation;
    job.workingTime = req.body.workingTime;
    job.seniorityLevel = req.body.seniorityLevel;
    job.technicalSkills = req.body.technicalSkills;
    job.softSkills = req.body.softSkills;
    await job.save();
    res.json({ success: true, message: "job updated successfully" })
    if (job.addedBy !== req.isUser._id)
        return next(new Error("you are not the applicant for this job"), { cause: 401 })
    if (!job)
        return next(new Error("user not found"), { cause: 404 })
    return res.json({ success: true, message: "done!!!", job })
});


export const deleteJob = asyncHandler(async (req, res, next) => {
    const { _id } = req.params

    const job = await Job.findOneAndDelete({ _id: req.params._id })

    if (!job) {
        return next(new Error("job not found"), { cause: 404 })
    }

    if (job.addedBy.toString() !== req.isUser._id.toString()) {

        return next(new Error("you are not the adder for the job"), { cause: 401 })
    }

    return res.json({ success: true, message: "job deleted successfully" })
})

export const jobsWithCompanies = asyncHandler(async (req, res, next) => {

    const job = await Job.find().populate({
        path: "companyID",
        select: "-_id",
    });

    if (job.length == 0) return next(new Error("No job with that name available!!"), { cause: 404 })

    return res.json({ success: true, results: { job } });
})


export const jobsForSpecificCompany = asyncHandler(async (req, res, next) => {
    const { companyName } = req.query;

    const company = await Company.find({ companyName: { $regex: new RegExp(companyName, 'i') } });

    if (company.length == 0) return next(new Error("No company with that name available!!"), { cause: 404 })


    const job = await Promise.all(company.map(async (company) => {
        const companyJobs = await Job.find({ companyID: company._id });
        return {

            job: companyJobs,
        };
    }));

    if (!job || job.length == 0) return next(new Error("No job with that name available!!"), { cause: 404 })

    return res.json({ success: true, results: { job } });

})

export const sepcificJob = asyncHandler(async (req, res, next) => {
    const filters = {};


    if (req.body.workingTime) {
        filters.workingTime = req.body.workingTime;
    }


    if (req.body.jobLocation) {
        filters.jobLocation = req.body.jobLocation;
    }


    if (req.body.seniorityLevel) {
        filters.seniorityLevel = req.body.seniorityLevel;
    }


    if (req.body.jobTitle) {
        filters.jobTitle = req.body.jobTitle;
    }


    if (req.body.technicalSkills) {

        // Split the comma-separated values into an array
        filters.technicalSkills = req.body.technicalSkills.split(',');
    }


    const job = await Job.find(filters);

    res.json({ success: true, results: job });


})


export const applyForJob = asyncHandler(async (req, res, next) => {
    const id = req.isUser.id;
    const jobId = req.body.jobId;

    // Check if the job exists
    const jobs = await Job.findById(jobId);
    if (!jobs) {
      return res.json({ error: 'Job not found' },{cause : 404});
    }

    // Create a new application document
    const application = new Application({
      jobId: job._id,
      userId,
      userTechSkills,
      userSoftSkills,
      userResume,
    });

    //upload file on cloudinary
    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        {
            folder: `job/${id}/resume`,
        }
    );


    //save URL in DB

    const job = await Job.findByIdAndUpdate(id, { resume: { secure_url, public_id } })
    
    // Save the application to the database
    await application.save();
    
    return res.json({ success: true, message: "file has been uploaded and application has been submitted" })
})