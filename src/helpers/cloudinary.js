const cloudinary = require('cloudinary').v2;
// const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env; 


// Configuration 
cloudinary.config({
    cloud_name: "dnltubxfg",
    api_key: "844335444318128",
    api_secret: "l-Ofz5_5jtLiLxALIpAB9s9xt9o"
  });

async function subirImagen(filePath) {
    return await cloudinary.uploader.upload(filePath)
}

module.exports = { 
    subirImagen 
};
