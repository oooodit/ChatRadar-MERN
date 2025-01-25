import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

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

export const login = async function (req, res) {
    const { email, password } = req.body;
    try {
        console.log("Login Request Body:", req.body);

        const user = await User.findOne({ email });
        console.log("Fetched User:", user);

        if (!user) {
            return res.status(400).json({ message: "Invalid UserID or Password." });
        }

        console.log("Password from Request:", password);
        console.log("Hashed Password from DB:", user.password);

        // Validate bcrypt arguments
        if (!password || !user.password) {
            console.error("Invalid arguments for bcrypt.compare:", {
                password,
                userPassword: user?.password,
            });
            return res.status(400).json({ message: "Invalid UserID or Password." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        console.log("Password Match:", isPasswordCorrect);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid UserID or Password." });
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (error) {
        console.error("Error in Login Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};


export const logout = function(req,res){
    try{
        res.cookie("jwt","",{ maxAge:0 }) //Clearing Cookie on Logout
        res.status(200).json({message: "Logged Out Successfully."})
    } catch(error){
        console.log("Error in Logout Controller.",error.message);
        res.status(500).json({message:"Internal Server Error"})
    }
};

export const updateProfile = async function(req,res){
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile Pic Not Provided."});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url}, {new:true});

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in Update Profile",error);
        res.status(500).json({messaage: "Internal Server Error"});
    }
};

export const checkAuth = async function(req,res){
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller",error.messaage);
        res.status(500).json({message: "Internal Server Error."});
    }
};