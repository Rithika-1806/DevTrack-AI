// models/userModel.js
// This file defines the User schema for MongoDB using Mongoose.
//
// A schema is like a blueprint — it tells MongoDB
// what fields a User document should have,
// what type each field is,
// and what rules/validations apply.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Full name of the user
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,           // Removes extra spaces
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    // Email must be unique — no two accounts with same email
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,      // Always stored in lowercase
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },

    // Password is stored as a hash, never plain text
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false         // Never returned in queries by default
    },

    // Optional GitHub username for GitHub integration
    githubUsername: {
      type: String,
      default: ''
    },

    // Profile picture URL
    profilePicture: {
      type: String,
      default: ''
    },

    // Tracks how many consecutive days user has logged in
    currentStreak: {
      type: Number,
      default: 0
    },

    // Calculated productivity score out of 100
    productivityScore: {
      type: Number,
      default: 0
    },

    // Last time user logged in — used for streak calculation
    lastLoginDate: {
      type: Date,
      default: null
    }
  },
  {
    // timestamps: true automatically adds:
    // createdAt → when the document was created
    // updatedAt → when the document was last updated
    timestamps: true
  }
);

// ==================== PRE-SAVE HOOK ====================
// This runs BEFORE every save() call on a User document.
// If the password field was changed, we hash it.
// This ensures password is ALWAYS hashed before storing.

userSchema.pre('save', async function (next) {
  // 'this' refers to the current user document

  // If password was NOT modified, skip hashing
  // (for example, if user only updated their name)
  if (!this.isModified('password')) {
    return next();
  }

  // Generate a salt — random data added to password before hashing
  // saltRounds = 12 means the hashing algorithm runs 2^12 = 4096 times
  // More rounds = more secure but slower
  const salt = await bcrypt.genSalt(12);

  // Hash the password using the salt
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// ==================== INSTANCE METHOD ====================
// This method is available on every user document.
// It compares a plain text password with the stored hash.
// Used during login to verify the password.

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);

module.exports = User;