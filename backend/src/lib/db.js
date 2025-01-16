import mongoose, { connect } from "mongoose";

export const connectDB = async function() {
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log("Couldn't Conntect to MongoDb, error:",error);
    }
};
