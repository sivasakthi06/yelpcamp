const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,     //clodinary config object
    params:{        //its mandatory to create the folder
        folder: 'YelpCamp',     //create a cloudinary folder to store our data
        allowFormats : ['jpeg', 'png', 'jpg']
    }
});

module.exports = {
    cloudinary,    //cloud config
    storage         //storage instance
}