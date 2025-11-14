import express from 'express'
import Chat from '../model/chat.model';

const Router=express.Router();

Router.route('/chat').post(async(req,res)=>{
    try {
        const {sender,reciver,message,date,time,room}=req.body;

        if(!sender || !reciver || !message || !date || !time){
            return res.status(400).json({message:"All fields are required"});
        }
        // Save chat message to database
        const newChat = new Chat({
            sender,
            reciver,
            message,
            date,
            time,
            room
        });
        await newChat.save();

        return res.status(200).json({message:"Message sent successfully",chat:newChat});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
})

Router.route('/getChat').post(async(req,res)=>{
    try {
        const {room}=req.body;
        if(!room){
            return res.status(400).json({message:"Room email is required"});
        }
        const chats=await Chat.find({room});
        return res.status(200).json({chats});
        
    } catch (error) {
       return res.status(500).json({message:"Internal server error"}); 
    }
})
export default Router;