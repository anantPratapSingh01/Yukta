import express from 'express';

import SaveUser from '../model/saveUser.model.js';

const Router = express.Router();

Router.route('/saveUser').post(async (req, res) => {
    try {
        const { user1,user2,room } = req.body;

        if (!user1 || !user2 || !room) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await SaveUser.findOne({ user1, user2, room });

        if (existingUser) {
            return res.status(200).json({ message: "User already exists", user: existingUser });
        }

        const newSaveuser= await SaveUser.create({
            user1,
            user2,
            room
        });
        return res.status(201).json({ message: "User saved successfully", user: newSaveuser });
    } catch (error) {
       return res.status(500).json({ message: "Server error", error: error.message }); 
    }
}
);

Router.route('/getSavedUsers').get(async (req, res) => {
    try {
        const savedUsers = await SaveUser.find();
        return res.status(200).json({ savedUsers });
    } catch (error) {   
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
);

export default Router;