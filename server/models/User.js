import mongoose from "mongoose";

// Create the schema for the User and how it will be saved in mongoDB
const UserSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        min: 5,
      },
      picturePath: {
        type: String,
        default: "",
      },
      friends: {
        type: Array,
        default: [],
      },
      location: String,
      occupation: String,
      viewedProfile: Number,
      impressions: Number,
    },
    // Tells us when user created/updated
    { timestamps: true }
  );

  // Configure the DB to be compatible with mongoose so we can use mongoose
  // commands on the DB
  const User = mongoose.model("User", UserSchema);

  // Export user table for use by other files
  export default User;