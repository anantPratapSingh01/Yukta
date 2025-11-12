import express from 'express'

const Router=express.Router();

Router.route('/cloudinary').post(async(req,res)=>{
    try {
        const imageUrlLocalPath = req.files?.imageUrl ? req.files.imageUrl[0]?.path : null;
        
        if(!imageUrlLocalPath){
            return res.status(400).json({ message: "image is required" });
        }

        const uploadResult = await uploaderFile(imageUrlLocalPath);
    if (!uploadResult) {
      return res.status(500).json({ message: "Image upload failed" });
    }
    const imageUrl = uploadResult.url;

    return res.status(200).json({message:"image uploaded",imageUrl});
    } catch (error) {
        return res.status(500).json({message:"Internal error"})
    }
})

export default Router;