import jwt from "jsonwebtoken"
export const generateToken = function(userId,res){
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7 days"
    })
    res.cookie("jwt",token,{
        maxAge: 7 * 24 * 60 * 60 * 1000,// MiliSec
        httpOnly:true,// prevent XSS attacks cross—site scripting attacks
        sameSite:"strict", // CSRF attacks cross—site request forgery attacks
        secure: process.env.NODE_ENV !== "development",
        //http to https-s(secure)
    });

    return token;
};


