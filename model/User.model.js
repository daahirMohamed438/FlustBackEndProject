const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    phone: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    currentToken: { type: String } // <-- add this

  },
  { timestamps: true }
);
// Create the User model
// This will create a "users" collection in MongoDB
const User = mongoose.model("User", userSchema);
// / Create the Owner model
// This uses the same schema as User but will create a separate "owners" collection
const  Owner = mongoose.model("Owner", userSchema);

// Export both models
// Other files can import { User, Owner } and use them to interact with MongoDB


module.exports =  User  
  
// };


