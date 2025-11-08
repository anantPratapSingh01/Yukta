import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    username: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    time: { type: String, required: true }
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;