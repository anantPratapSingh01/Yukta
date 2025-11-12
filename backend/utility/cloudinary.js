import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';



cloudinary.config({ 
        cloud_name: 'dfzvpxepq', 
        api_key:279327997386913, 
        api_secret: 'VYaDLrNbImBHtpd3HS0FHR7pdVw'
    });
 console.log("Cloudinary config:",cloudinary.config());





const uploaderFile = async (localFilePath) => {
   try {
      if (!localFilePath) return null;
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: 'auto',
      })
      
      console.log("file is successfully uploaded in our server")
      console.log(response.url)
      return response;
   } catch (error) {
      fs.unlinkSync(localFilePath); 
      console.error("Error uploading file to Cloudinary:", error);
      return null; 
   }
}

export { uploaderFile };