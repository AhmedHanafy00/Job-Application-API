export const asyncHandler = (contoller)=>{
    return (req,res,next)=>{
        contoller(req,res,next).catch((error)=> next(error))
    }
}