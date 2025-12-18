import express from 'express';
import Notification from '../model/notification.model.js';

const Router = express.Router();

Router.route('/notification').post(async (req, res) => {
    try {
        const {sender, reciver, message, date, time, room} = req.body;
        console.log(req.body)

        if(!sender || !reciver || !message || !date || !time || !room){
            return res.status(400).json({message:"All fields are required"});
        }

        
        const result = await Notification.findOneAndUpdate(
            { room: room },
            { 
                sender,
                reciver,
                message,
                date,
                time,
                room
            },
            {
                new: true, 
                upsert: true 
            }
        );

        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error"});
    }
});

Router.route('/getNotifications').post(async (req, res) => {
    try {
        const { reciver } = req.body;
        
        if (!reciver) return res.status(400).json({ message: "reciver is required" });

       
        const notifications = await Notification.find({ reciver }).sort({ createdAt: -1 });
        
        res.status(200).json({ notifications }); 
    } catch (error) {
        console.log("error",error)
        res.status(500).json({ message: "Internal server error" , error: error.message });
    }
});

export default Router;