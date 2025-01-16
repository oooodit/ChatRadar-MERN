import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async function(req,res){
    const {fullName,email,password}=req.body;
    try {
        //hash password bcrypt package usage - encrypts 
        //Validations While Signup
        if (!fullName || !email || !password ){
            return res.status(400).json({message: "Please fill all the fields."});
        }

        if (password.length<6){
            return res.status(400).json({message: "Password must be at least of 6 chracters."});
        }
        const user = await User.findOne({email})
        if (user) return res.status(400).json({message: "Email already exists"})

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        
        const newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })

        if(newUser){
            //Generate JWT - Json Web Tokan 
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message: "Invalid User Data"})
        }
    
    } catch (error) {
        console.log("Error in Signup Controller",error.message);
        res.status(500).json({message:"Internal Server Error - Something is broken"});
    }
};

export const login = function(req,res){
    res.send("login route")
};

export const logout = function(req,res){
    res.send("logout route");
};

