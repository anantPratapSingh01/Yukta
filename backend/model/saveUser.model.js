import mongoose from "mongoose";

const saveUserSchema =new mongoose.Schema({
    user1:{type:String,required:true},
    user2:{type:String,required:true},
    room:{type:String,required:true}
},{
    timestamps:true
})

const SaveUser=mongoose.models.SaveUser || mongoose.model("SaveUser",saveUserSchema);

export default SaveUser;