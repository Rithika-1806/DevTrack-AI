// models/taskModel.js
// Defines the shape of a Task document in MongoDB.
// Every task belongs to one project AND one user.
// This double reference lets us:
// - Get all tasks for a project
// - Get all tasks for a user
// without complex joins (MongoDB is NoSQL).

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    // Task title
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },

    // Task description
    description: {
      type: String,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters']
    },

    // Task deadline
    deadline: {
      type: Date,
      default: null
    },

    // Priority
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },

    // Status
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending'
    },

    // Estimated hours to complete the task
    estimatedHours: {
      type: Number,
      default: 0
    },

    // When the task was actually completed
    completedDate: {
      type: Date,
      default: null
    },

    // Which project this task belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },

    // Which user owns this task
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;