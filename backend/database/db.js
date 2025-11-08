import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        console.log("id of db");
        await mongoose.connect("mongodb+srv://Anant:Anant123@cluster0.ekc909m.mongodb.net/socket");
        console.log("Database connected");
    } catch (error) {
        console.log("Database connection error",error);
        
    }
}