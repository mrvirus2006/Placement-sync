const mongoose = require('mongoose');

// This is the Blueprint for every student who signs up
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two students can have the same email
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false, // By default, a user is a student, not an admin
    },
  },
  {
    timestamps: true, // Automatically adds 'Created At' and 'Updated At' times
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;