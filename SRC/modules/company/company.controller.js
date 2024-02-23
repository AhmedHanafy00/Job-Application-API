import { Company } from "../../../DB/collections/company.collection.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import { User } from "../../../DB/collections/user.collection.js";
import { Job } from "../../../DB/collections/job.collection.js";
export const addCompany = asyncHandler(async (req, res, next) => {

    const company = await Company.findOne({ companyHR: req.body.companyHR })

    await Company.create(req.body);

    return res.json({ success: true, message: "Company created successfully " });

})

export const updateCompany = asyncHandler(async (req, res, next) => {
    const company = await Company.findOne({ companyHR: req.body.companyHR });
    if (!company) {
        res.json({ success: false, message: "company doesn't exist" },{ cause: 404 })
    }
    if (company.companyHR.toString() !== req.body.companyHR) {
        res.json({ success: false, message: "Incorrect company Owner" },{ cause: 401 })
    }
    company.companyName = req.body.companyName;
    company.description = req.body.description;
    company.industry = req.body.industry;
    company.address = req.body.address;
    company.numberOfEmployees = req.body.numberOfEmployees;
    await company.save();
    res.json({ success: true, message: "company updated successfully" })
    if (company.companyHR !== req.isUser._id)
        return next(new Error("you are not the owner"),{ cause: 401 })
    if (!company)
        return next(new Error("user not found"),{ cause: 404 })
    return res.json({ success: true, message: "done", company })
})


export const deleteCompany = asyncHandler(async (req, res, next) => {
    const { _id } = req.params


    const company = await Company.findById({ _id: req.params._id })

    if (!company) {
        return next(new Error("company not found"),{ cause: 404 })
    }

    if (company.companyHR.toString() !== req.isUser._id.toString()) {

        return next(new Error("you are not the owner of the company"),{ cause: 401 })
    }

    await Company.findOneAndDelete({ _id: req.params._id })

    return res.json({ success: true, message: "company deleted successfully" })
})


export const companyData = asyncHandler(async (req, res, next) => {
    const { _id } = req.params

    const company = await Company.findById({ _id: req.params._id })
   

    if (!company) {
        return next(new Error("company not found"),{ cause: 404 })
    }

    if (company.companyHR.toString() !== req.isUser._id.toString()) {

        return next(new Error("you are not the owner of the company"),{ cause: 401 })
    }
   
    const job = await Job.find({companyID:  req.params._id})

    const companyWithJobs = {...company.toObject(), companyJobs:job}
    
    return res.json({ success: true, results: { companyWithJobs } });

})


export const searchCompany = asyncHandler(async (req, res, next) => {
    const { companyName } = req.body;

    const company = await Company.find({ companyName: { $regex: new RegExp(companyName, 'i') } });

    if (company.length == 0) return next(new Error("No company with that name available!!"),{ cause: 404 })

    return res.json({ success: true, results: { company } });

})


export const getAppForJobs = asyncHandler(async(req,res,next)=>{
    const companyId = req.user.companyID; 

 
  const company = await Company.findById(companyId);
  if (!company) {
    return next(new Error("company not found"),{ cause: 404 })
  }


  const jobs = await Job.find({ companyID: companyId });


  const applicationsPromises = jobs.map(async (job) => {
    const jobApplications = await Application.find({ jobId: job._id }).populate('userId', 'userName email'); // Add other fields if needed
    return { job, applications: jobApplications };
  });

  const applicationsResults = await Promise.all(applicationsPromises);

  return res.json({ success: true, results: applicationsResults });
});
