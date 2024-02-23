import mongoose from 'mongoose';

export const connectDB = async ()=>{

    return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(()=>console.log("DataBase connected"))
    .catch((err)=>{
        console.log({message : "connection error",err});
    });
;}