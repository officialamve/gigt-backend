const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true
  },

  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { 
    type: String, 
    required: true,
    select: false
  },

  coins: { 
    type: Number, 
    default: 0 
  },

  role: {
    type: String,
    default: "user"
  },

  isCreator: {
    type: Boolean,
    default: false
  },

  creatorProfile: {
    displayName: { type: String },
    category: { type: String },
    bio: { type: String },
    verified: { type: Boolean, default: false }
  },

  usernameChangedAt: {
    type: Date,
    default: null
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }

});

module.exports = mongoose.model("User", UserSchema);