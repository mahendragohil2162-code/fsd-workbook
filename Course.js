const mongoose = require('mongoose');

// Define Schema with strict validation rules
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is mandatory'],
      trim: true
    },
    code: {
      type: String,
      required: [true, 'Course code is mandatory'],
      uppercase: true,
      trim: true
    },
    credits: {
      type: Number,
      required: true,
      min: [1, 'Credits must be at least 1'],
      max: [6, 'Credits cannot exceed 6']
    },
    department: {
      type: String,
      enum: ['Computer Applications', 'Information Technology', 'Data Science'],
      default: 'Computer Applications'
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Automatically generates createdAt and updatedAt
  }
);

module.exports = mongoose.model('Course', courseSchema);