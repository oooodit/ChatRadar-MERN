import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config()
const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json())

app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).send("Route not found");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
});
