// models/projectModel.js
// Defines the shape of a Project document in MongoDB.
// Every project belongs to one user (owner).
// One user can have many projects — this is a
// one-to-many relationship handled by storing
// the user's ID inside the project document.

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    // Project title
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },

    // Detailed description
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Project deadline
    deadline: {
      type: Date,
      default: null
    },

    // Priority level
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },

    // Current status
    status: {
      type: String,
      enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
      default: 'Planning'
    },

    // Progress percentage — 0 to 100
    // Automatically calculated based on tasks completed
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    // Which user owns this project
    // ref: 'User' tells Mongoose this ID refers to the User collection
    // This allows us to use .populate() to get full user details
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // Tech stack or tags for the project
    tags: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;