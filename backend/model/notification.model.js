import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: { type: String, required: true },
    reciver: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    time: { type: String, required: true },
    room: { type: String, required: true },
},{ timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
       