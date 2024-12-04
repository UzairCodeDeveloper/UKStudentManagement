const mongoose = require('mongoose');

// Create a schema for the grade
const gradingSchema = new mongoose.Schema({
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',  // Assuming you have a class model
    required: true
  },
  exam_name: {
    type: String,
    required: true
  },
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User (student)
    required: true
  },
  obtained_marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  date_assigned: {
    type: Date,
    default: Date.now
  }
});

// Create a model based on the schema
const Grading = mongoose.model('Grading', gradingSchema);

module.exports = Grading;
