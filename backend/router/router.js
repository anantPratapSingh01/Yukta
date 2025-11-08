import experss from "express";
import Chat from "../model/chat.model.js";
const Router = experss.Router();

Router.route("/addChat").post(async(req, res) => {
    try {
        const {username, message,date,time} = req.body;
        if(!username || !message || !time){
            return res.status(400).json({msg: "Please provide all the fields"});
        }
        const newChat= await Chat.create({
            username,
            message,
            date,
            time
        });
        return res.status(201).json({msg: "Chat added successfully", chat: newChat })
    } catch (error) {
        return res.status(500).json({msg: "Server error", error: error.message});
    }
}
);

Router.route("/getChats").get(async(req, res) => {
    try {
        const chats = await Chat.find().sort({date: 1});
        return res.status(200).json({chats});
    } catch (error) {
        return res.status(500).json({msg: "Server error", error: error.message});
    }
}
);

export default Router;