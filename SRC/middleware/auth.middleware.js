import { Token } from "../../DB/collections/token.collection.js";
import { User } from "../../DB/collections/user.collection.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import Jwt from "jsonwebtoken";
export const isAuthenticated = asyncHandler(async (req, res, next) => {
    // check who is the user 
    let { token } = req.headers;
    // check token existence 
    if (!token) return next(new Error("token missing !", { cause: 400 }));
    //check prefix (bearer token)
    if (!token.startsWith(process.env.BEARER_KEY)) return next(new Error("Wrong Token!", { cause: 401 }));



    token = token.split(process.env.BEARER_KEY)[1];

    //check the Token if its valid nad in DB 

    const tokenDB = await Token.findOne({ token, isValid: true })

    if (!tokenDB) return next(new Error("Token Invalid!!", { cause: 401 }))

    //verify the Token
    const payload = Jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
        return next(new Error("User isn't found", { cause: 404 }));
    }
    // pass user to user controller 
    req.isUser = user;

    return next();

})

// to check if User can create companies or not (role is HR or not)
export const roleAuthenticated = asyncHandler(async (req, res, next) => {
    // check who is the user 
    let { token } = req.headers;
    // check token existence 
    if (!token) return next(new Error("token missing !", { cause: 400 }));
    //check prefix (bearer token)
    if (!token.startsWith(process.env.BEARER_KEY)) return next(new Error("Wrong Token!", { cause: 401 }));



    token = token.split(process.env.BEARER_KEY)[1];

    //check the Token if its valid nad in DB 

    const tokenDB = await Token.findOne({ token, isValid: true })

    if (!tokenDB) return next(new Error("Token Invalid!!", { cause: 401 }))

    //verify the Token
    const payload = Jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
        return next(new Error("User isn't found", { cause: 404 }));
    }

    if (user.role == "user") {
        return next(new Error("you aren't autherized to make such process,only HR creates companies!"), { cause: 401 })

    }
    if (user.role == "Company_HR")

        // pass user to user controller 
        req.isUser = user;

    return next();

})


// for role user only
export const userAuthenticated = asyncHandler(async (req, res, next) => {
    // check who is the user 
    let { token } = req.headers;
    // check token existence 
    if (!token) return next(new Error("token missing !", { cause: 400 }));
    //check prefix (bearer token)
    if (!token.startsWith(process.env.BEARER_KEY)) return next(new Error("Wrong Token!", { cause: 401 }));



    token = token.split(process.env.BEARER_KEY)[1];

    //check the Token if its valid nad in DB 

    const tokenDB = await Token.findOne({ token, isValid: true })

    if (!tokenDB) return next(new Error("Token Invalid!!", { cause: 401 }))

    //verify the Token
    const payload = Jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
        return next(new Error("User isn't found", { cause: 404 }));
    }

    if (user.role == "Company_HR") {
        return next(new Error("you aren't autherized to apply for a job!!"), { cause: 401 })

    }
    if (user.role == "user")

        // pass user to user controller 
        req.isUser = user;

    return next();

})