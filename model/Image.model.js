const mongoose = require('mongoose')
 
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String, // path or URL to the uploaded image
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
