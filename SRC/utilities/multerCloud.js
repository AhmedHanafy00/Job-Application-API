import multer, { diskStorage } from "multer";


export const fileValidation = {

    files: ["application/pdf"]

};


export function uploadFileCloud() {
    const storage = diskStorage({});  //save file in system "temp"

    const filter = ["application/pdf"];
    const fileFilter = (req,file,cb)=>{
        //file type pdf
        //filter to get desired file type
        if (!filter.includes(file.mimetype)){
            
           return cb(new Error ("Invalid format , file must be PDF!"),false )
        }
        return cb(null,true);

    };

    const multerUpload = multer({ storage, fileFilter });


    return multerUpload;
}