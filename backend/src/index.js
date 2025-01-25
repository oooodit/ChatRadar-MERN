import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());

app.use(cookieParser()); //middleware usage

app.use("/api/auth", authRoutes);

app.use((req, res) => {
    console.error(`Route not found: ${req.method} ${req.url}`);
    res.status(404).send("Route not found");
});

app.use((err, req, res, next) => {
    console.error("Error occurred:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB().catch((error) => {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    });
});
