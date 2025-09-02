require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./router/User.Router'); 
const ownerRouter = require("./router/owner.router");
const flatRouter = require("./router/flat.router");
const bookingRouter = require("./router/booking.router");
const app = express();
-
// Middleware
app.use(cors());
app.use(express.json());  

// Set base URL from environment variable or default to '/api'
const baseUrl = '/URLFluster'; // process.env.BASE_URL ||

// Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(async () => {
//     console.log('Connected to MongoDB');
    
//     // Update all user ratings on server start
//     try {
//       const userModel = require('./model/User.model');
//       const reviewModel = require('./model/review.model');
      
//       const users = await userModel.find();
//       for (const user of users) {
//         const reviews = await reviewModel.find({ userId: user._id });
//         let averageRating = 0;
//         let reviewCount = 0;
        
//         if (reviews.length > 0) {
//           const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//           averageRating = totalRating / reviews.length;
//           reviewCount = reviews.length;
//         }
        
//         await userModel.findByIdAndUpdate(user._id, {
//           rating: Math.round(averageRating * 10) / 10,
//           reviewCount: reviewCount
//         });
//       }
//       console.log('All user ratings updated successfully');
//     } catch (error) {
//       console.error('Error updating user ratings:', error);
//     }
//   })
//   .catch(err => console.error('MongoDB connection error:', err));


// ✅ Direct MongoDB connection (no .env)
mongoose.connect("mongodb://127.0.0.1:27017/flustelDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));
// Mount user routes under the base URL
app.use(baseUrl, userRoutes);
 //
 app.use(baseUrl, ownerRouter);
 app.use(baseUrl, flatRouter);

 app.use(baseUrl, bookingRouter);
 //
 //
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`${process.env.URL_SERVER || 'Server'} running on ${baseUrl} at http://localhost:${PORT}`);
});
