import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile); //protectRoute - Middleware: User Must be Logged-in to Update Profile

router.get("/check",protectRoute,checkAuth); //check if user is authencated.

export default router;
