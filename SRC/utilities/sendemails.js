import nodemailer from "nodemailer";

export async function sendEmails({to , subject , html}) {

    // create transporter

    const transporter = nodemailer.createTransport({
        host : "localhost",
        port : 465,
        secure : true,
        service : "gmail",
        auth : {
            user : process.env.EMAIL,
            pass : process.env.PASS,
        }
    })

    const info = await transporter.sendMail({
        from :`"hello again" ${process.env.EMAIL}`,
        to  ,
        subject  ,
        html
    })


    if (info.accepted.length > 0) return true;

    return false;
};

