const path = require('path');
async function uploadImage(image) {
    try {
        const fileExt = path.extname(image.name); 
        const filename = `${Date.now()}_${Math.floor(Math.random() * 10000)}${fileExt}`; 
        await image.mv(`uploads/${filename}`);
        return `uploads/${filename}`;
    } catch (error) {
        throw new Error('Failed to upload image: ' + error.message);
    }
}

module.exports = {
    uploadImage
  };