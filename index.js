import express from "express";
import { connectDB } from './DB/connection.js';
import userRouter from "./SRC/modules/user/user.router.js"
import jobsRouter from "./SRC/modules/jobs/jobs.router.js"
import companyRouter from "./SRC/modules/company/company.router.js"
import  dotenv  from "dotenv";
const app = express();
dotenv.config();
const port = process.env.PORT;

app.use(express.json());

await connectDB();

// APIs for user 

app.use("/user", userRouter)


// APIs for jobs 

app.use("/jobs", jobsRouter)


// APIs for company 

app.use("/company", companyRouter)


// API to handle the "not found pages".


app.all("*", (req, res,next) => {
    return res.json({ 
        success: false,
        message: "page not found!"
    });
})

// API to handle global errors

app.use((error,req,res,next)=>{
    const statusCode= error.cause||500;
    return res.status(statusCode).json ({
        success : false,
        message : error.message,
        stack : error.stack
    });
});



app.listen(port, () => console.log(`App is up and running at Port ${port} `));

