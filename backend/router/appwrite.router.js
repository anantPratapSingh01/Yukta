import express from 'express'
import {Client, Storage,ID } from "appwrite";

const Router=express.Router();

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // ✅ tumhara endpoint
  .setProject("68c79252003261afcea4"); // ✅ tumhara project ID

const storage = new Storage(client);



Router.route('/appwrite').post(async(req,res)=>{
    try {
        const {file}=req.body;

         const uploadedFile = await storage.createFile(
        "68c794740014400af82a", 
        ID.unique(),
        file
      );
      if(!uploadedFile){
        return res.status(400).json({message:"file upload failed"})
      }
      const pdfUrl =
        client.config.endpoint +
        "/storage/buckets/68c794740014400af82a/files/" +
        uploadedFile.$id +
        "/view?project=" +
        client.config.project;

        if(!pdfUrl){
            return res.status(400).json({message:"pdf failed"})
        }

        return res.status(200).json({message:"pdf uploaded",pdfUrl});
    } catch (error) {
       return res.status(500).json({message:"Internal error"}); 
    }
});

export default Router;