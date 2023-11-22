import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: 'bepawsome', 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadImages = async (images) => {
  try {
    // Convierte a array si solo se proporciona una ruta de imagen
    
    if (!Array.isArray(images)) {
        images = [images]; // Convierte a un array si no es un array
      }
      
    const uploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image);
      return result;
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error);
    throw error;
  }
};

export default uploadImages;
