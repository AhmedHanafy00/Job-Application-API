import { parse } from "dotenv";
import { User } from "../../../DB/collections/user.collection.js";
import { asyncHandler } from "../../utilities/asyncHandler.js";
import bcryptjs from "bcryptjs";
import Jwt from "jsonwebtoken";
import { Token } from "../../../DB/collections/token.collection.js";
import joi from "joi";
import { sendEmails } from "../../utilities/sendemails.js";
import randomstring from "randomstring"


export const signupUser = asyncHandler(async (req, res, next) => {
    //password check
    if (req.body.password !== req.body.confirmPassword) {
        return next(new Error("password isn't correct"), { cause: 401 });
    }
    //user existance check
    const ifUser = await User.findOne({ email: req.body.email })

    if (ifUser) {
        return next(new Error("email already exists"), { cause: 401 });
    }
    //Hashing the password
    const hashPassword = bcryptjs.hashSync(req.body.password, parseInt(process.env.SALT_ROUND));

    const userName = (req.body.firstName + req.body.lastName).toLowerCase();

    const user = await User.create({ ...req.body, password: hashPassword });

    // generate token
    const token = Jwt.sign({ email: user.email }, process.env.TOKEN_SECRET);


    //send email

    const messageSent = await sendEmails({
        to: user.email,
        subject: "account activation",
        html: `<a href = 'http://localhost:4000/user/activate_account/${token}'>Activate your account</a>`
    });

    if (!messageSent) {
        return next(new Error("Email is invalid !!!", { cause: 400 }))
    }

    const userWithUserName = {
        ...user.toObject(),
        userName,
    };

    return res.json({ success: true, results: { user: userWithUserName } });

});

export const signin = asyncHandler(async (req, res, next) => {

    //user check
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new Error("user isn't found"), { cause: 404 });
    }

    // account activation check

    if (!user.isConfirmed) {
        return next(new Error("your account is not activated"), { cause: 400 })
    }


    //comparing the passwords 
    const match = bcryptjs.compareSync(req.body.password, user.password);

    if (!match) {
        return next(new Error("invalid password", { cause: 401 }));
    }
    //generate Token
    const token = Jwt.sign({ id: user._id, email: user.email }, process.env.TOKEN_SECRET)

    //saving the Token in the Token model

    await Token.create({
        token,
        user: user._id,
        agent: req.headers["user-agent"],
    });
    user.isOnline = true;
    await user.save();

    return res.json({ success: true, token })


});


export const changePassword = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new Error("invalid email"), { cause: 401 });
    }
    const match = bcryptjs.compareSync(req.body.password, user.password);

    if (!match) {
        return next(new Error("invalid password"), { cause: 401 });
    }
    const hashedPassword = await bcryptjs.hash(req.body.newPassword, parseInt(process.env.SALT_ROUND))

    user.password = hashedPassword;

    await user.save();

    return res.json({ success: true, message: "new password saved" })

}

)


export const updateUser = asyncHandler(async (req, res, next) => {

    const user = await User.findOneAndUpdate({ email: req.body.email },
        {
            phone: req.body.phone,
        },
        { new: true })

    if (user) {
        user.isOnline = true;
    }
    return res.json({
        success: true,
        message: "user updated !",
        results: { user }
    })

})

export const deleteUser = asyncHandler(async (req, res, next) => {

    const user = await User.findOneAndDelete({ email: req.body.email });
    if (user) {
        await Token.findOneAndUpdate({ token: req.headers.token }, { isValid: false })

    }
    if (user) {
        user.isOnline = false;
    }

    return res.json({
        success: true,
        message: "user deleted!",
        results: { user }
    })

});


export const getAccountData = asyncHandler(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new Error("invalid email"), { cause: 401 });
    }

    if (user.email !== req.body.email) {
        return next(new Error("you can't access this data"), { cause: 401 });
    }

    return res.json({ success: true, results: { user } })
})


export const profileData = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.id })

    if (!user) {
        return next(new Error("wrong input!"), { cause: 401 });
    }

    if (user.id !== req.params.id) {
        return next(new Error("you can't access this data"), { cause: 401 });
    }
    return res.json({ success: true, results: { user } })
})

export const activateAccount = asyncHandler(async (req, res, next) => {

    const { token } = req.params;

    //payload 
    const payload = Jwt.verify(token, process.env.TOKEN_SECRET);

    //update the situiation

    const user = await User.findOneAndUpdate({ email: payload.email },
        { isConfirmed: true },
        { new: true }
    );

    return res.send("Account has been activated successfully! please log in now")
});


export const sendForgetCode = asyncHandler(async (req, res, next) => {
    // check on the user existance
    const user = await User.findOne({ email: req.body.email })
    if (!user) next(new Error("user not found "), { cause: 404 });

    //check activation

    if (!user.isConfirmed) next(new Error("you  need to activate the account"))

    // generate the code to be sent to user inorder to reset the password

    const code = randomstring.generate({
        length: 5,
        charset: "numeric",
    })

    // save the code in the DB

    user.forgetCode = code;
    await user.save();

    // send email to user

    const messageSent = await sendEmails({
        to: user.email,
        subject: "reset password",
        html: `<div>${code}</div>`
    });

    if (!messageSent) return next(new Error("invalid email "), { cause: 401 })

    return res.send("you can reset your password now")
});


export const resetPassword = asyncHandler(async (req, res, next) => {
    // check on the user existance
    const user = await User.findOne({ email: req.body.email })
    if (!user) next(new Error("user not found "), { cause: 404 });

    //check code
    if (user.forgetCode !== req.body.code) return next(new Error("the code doesn't match"))

    //delete the "forget code"

    await User.findOneAndUpdate({
        email: req.body.email,
    },
        { $unset: { forgetCode: 1 } }
    )

    user.password = bcryptjs.hashSync(req.body.password, parseInt(process.env.SALT_ROUND))

    await user.save();

    // invalidate tokens

    const tokens = await Token.find({ user: user._id })

    tokens.forEach(async (token) => {
        token.isValid = false;
        await token.save();
    })
    return res.json({ success: true, message: "try to signin now" })


});

export const recoveryEmailAccounts = asyncHandler(async (req, res, next) => {
    const user = await User.find({ recoveryEmail: req.body.recoveryEmail })
    if (!user) next(new Error("user not found "), { cause: 404 });

    return res.json({ sucess: true, results: { user } })
});

export const logout = asyncHandler(async (req, res, next) => {

    await Token.findOneAndUpdate({ token: req.headers.token }, { isValid: false })

    return res.json({ success: true, message: "User logged out" })
});
